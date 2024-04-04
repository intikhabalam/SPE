import { useTheme } from '@fluentui/react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { OdspInteractiveMessage, OdspMessage } from '@ms/copilot-common/lib/OdspMessage';
import type { AppName } from '@ms/copilot-common/lib/appNames';
import type { ODSLResponseHandler } from '@ms/copilot-common/lib/responseHandlers/ODSLResponseHandler';
import type { IQueryAnnotation } from '@augloop-types/odsp-copilot';
import {
  APP_QUERY_PARAM_KEY,
  CHATODSP_ALTEST_QUERY_PARAM_KEY,
  CHATODSP_QUERY_PARAM_KEY,
  type IAddResponseCommand,
  type IChatODSPCommand,
  type IChatODSPConfigureCommand,
  type IChatODSPGenerateQueryContextResult,
  type IChatODSPHandoffODSLResult,
  type IChatODSPNotification,
  type IChatODSPOptions,
  type IChatODSPPreProcessQueryResult,
  type IUpdateResponseCommand,
  type IChatODSPUpdateThemeCommand,
  type IChatODSPGenerateQueryContextCommand,
  type IChatODSPPreProcessQueryCommand
} from '@ms/embed-host-contracts/lib/chatodsp/Sdk10';
import {
  createHost,
  type ICommand,
  type ICommandOptions,
  type IErrorResult,
  type IMessenger,
  type IResult,
  type ISuccessResult
} from '@ms/utilities-cross-window';
import type { IMessengerParams } from '@ms/utilities-cross-window/lib/communication/Messenger';
import { ApiError } from '@ms/utilities-error';
import * as Guid from '@ms/utilities-guid';
import { graft } from '@ms/utilities-objects/lib/Graft';
import { pickObject } from '@ms/utilities-objects/lib/objects';
import { useEventHandler, useMediaQuery } from '@ms/utilities-react';
import * as React from 'react';
import { createCopilotTheme } from './utilities/ThemeUtils';

//import * as styles from './Copilot.module.scss';

const useStyles = makeStyles({
  frame: {
    width: '100%',
    height: '100%',
    ...shorthands.border('0px'),
    backgroundColor: 'white',
  }
});


/**
 * Options used to configure ChatODSP
 */
export interface ICopilotChatHostOptions extends Partial<Omit<IChatODSPOptions, 'messaging' | 'sdk'>> {}

/**
 * Results of the initial load of the ChatODSP host
 */
export interface ICopilotChatHostLoadResultProps {
  error?: Error;
}

/**
 * Props for the ChatODSP host
 */
export interface ICopilotChatHostProps {
  /**
   * Telemetry ClientName of the host app
   */
  app: AppName;
  /**
   * The URL to the base page for ChatODSP
   */
  chatEmbeddedPageUrl: string;
  /**
   * Options to configure ChatODSP
   */
  options?: ICopilotChatHostOptions;
  /**
   * Callback when the picker initially loads. May contain an error if the list content failed to load.
   */
  onLoad: (resultProps: ICopilotChatHostLoadResultProps) => void;
  /**
   * An additional handler for commands.
   */
  onCommand?: IMessengerParams['onCommand'];
  /**
   * An additional handler for notifications.
   */
  onNotification?: IMessengerParams['onNotification'];
  /**
   * An optional callback to obtain an OAuth token for the initial page-load.
   * Subsequent token requests must be handled via the 'authenticate' command in an `onCommand` handler.
   */
  getAuthToken?: (params: { url: string }) => Promise<string | undefined>;
  /**
   * Whether or not to reload the page on changes to the `entry` option.
   */
  reloadOnEntry?: boolean;

  preProcessQuery?: (query: string, annotations?: IQueryAnnotation[]) => Promise<string>;
  generateQueryContext?: (query: string, annotations?: IQueryAnnotation[]) => Promise<string>;
  odslResponseHandler?: ODSLResponseHandler;
}

export interface ICopilotChatHostRef {
  sendCommand: IMessenger['sendCommand'];
}

export const EmbeddedChat = React.forwardRef<ICopilotChatHostRef | undefined, ICopilotChatHostProps>(
  (
    props: ICopilotChatHostProps,
    ref: React.ForwardedRef<ICopilotChatHostRef | undefined>
  ): JSX.Element => {
    const {
      app,
      chatEmbeddedPageUrl: chatODSPPageUrl,
      options,
      onNotification: propsOnNotification,
      getAuthToken,
      preProcessQuery,
      generateQueryContext,
      odslResponseHandler
    } = props;

    const [contentWindow, setContentWindow] = React.useState<Window | null>(null);

    const loadErrorRef = React.useRef<Error>();

    const onLoad = useEventHandler(props.onLoad);

    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

    const interactiveMessages = React.useMemo(() => {
      return new Map<string, OdspInteractiveMessage>();
    }, []);

    // eslint-disable-next-line prefer-const
    let addMessage: (responseMessage: OdspMessage) => Promise<void>;

    // eslint-disable-next-line prefer-const
    let updateMessage: (responseMessage: OdspMessage) => Promise<void>;

    const onLoadIframe: React.ReactEventHandler<HTMLIFrameElement> = useEventHandler(
      (event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        if (iframeRef.current && contentWindow) {
          return;
        }
        const iframeElement = event.target as HTMLIFrameElement | null;
        iframeRef.current = iframeElement;
        setContentWindow((iframeElement && iframeElement.contentWindow) || null);
      }
    );

    const onIFrameRef = React.useCallback((iframeElement: HTMLIFrameElement | null) => {
      iframeRef.current = iframeElement;
      setContentWindow((iframeElement && iframeElement.contentWindow) || null);
    }, []);

    const onIFrameError = useEventHandler((e: React.SyntheticEvent<HTMLIFrameElement>) => {
      if (!loadErrorRef.current) {
        loadErrorRef.current = new ApiError({
          code: 'UnableToLoadChatODSPFrame'
        });

        if (onLoad) {
          onLoad({
            error: loadErrorRef.current
          });
        }
      }
    });

    const isHighContrast = useMediaQuery('(forced-colors: active)');

    const [channelId] = React.useState(() => `ChatODSP-${Guid.generate()}`);

    const v8Theme = useTheme();
    const chatodspOptions = React.useMemo((): IChatODSPOptions => {
      // process theme in options if defined
      const finalOptions: IChatODSPOptions = {
        ...options,
        theme: v8Theme
          ? createCopilotTheme({ v8Theme, isHighContrast, overrideTheme: options?.theme })
          : undefined,
        themeV8: v8Theme
      };
      // merge options from props with base options
      return graft<IChatODSPOptions>(
        {
          sdk: '1.0.0',
          authentication: {
            enabled: true,
            claimsChallenge: { enabled: true },
            tokens: {
              augloop: true
            }
          },
          messaging: {
            origin: window.location.origin,
            channelId,
            identifyParent: false,
            waitForConfiguration: false
          }
        },
        finalOptions
      );
    }, [v8Theme, options, channelId, isHighContrast]);

    const iframeUrl = React.useMemo(() => {
      // Pick a subset of options which are requried for upfront configuration to be serialized into the query string.
      const queryStringOptions: IChatODSPOptions = {
        ...pickObject(chatodspOptions, ['sdk', 'authentication', 'messaging', 'telemetry'])
      };

      const url = new URL(chatODSPPageUrl);
      url.searchParams.set(APP_QUERY_PARAM_KEY, app);
      url.searchParams.set(CHATODSP_QUERY_PARAM_KEY, JSON.stringify(queryStringOptions));

      // Add Al Test query string param
      const urlParams = new URLSearchParams(window.location.search);
      const alTest = urlParams.get(CHATODSP_ALTEST_QUERY_PARAM_KEY);
      if (alTest) {
        url.searchParams.set(CHATODSP_ALTEST_QUERY_PARAM_KEY, alTest);
      }
      return url.toString();
    }, [app, chatodspOptions, chatODSPPageUrl]);

    const onNotification = useEventHandler((notification: IChatODSPNotification) => {
      switch (notification.notification) {
        case 'page-loaded':
          let error: Error | undefined;

          const { error: notificationError } = notification;

          if (notificationError) {
            error = new ApiError({
              code: notificationError.code,
              message: notificationError.message,
              isExpected: notificationError.isExpected
            });
          }

          onLoad({ error });
          break;
      }

      if (propsOnNotification) {
        propsOnNotification(notification);
      }
    });

    const onCommand = useEventHandler(
      (odspCommand: IChatODSPCommand): IResult | Promise<IResult> | undefined => {
        switch (odspCommand.command) {
          case 'preProcessQuery':
            if (preProcessQuery) {
              return preProcessQuery(
                odspCommand.query,
                (odspCommand as IChatODSPPreProcessQueryCommand).annotations
              ).then(
                (processedQuery: string) =>
                  ({
                    preProcessedQuery: processedQuery
                  } as IChatODSPPreProcessQueryResult)
              );
            } else {
              return Promise.resolve({
                preProcessedQuery: odspCommand.query
              } as IChatODSPPreProcessQueryResult);
            }
          case 'generateQueryContext':
            if (generateQueryContext) {
              return generateQueryContext(
                odspCommand.query,
                (odspCommand as IChatODSPGenerateQueryContextCommand).annotations
              ).then(
                (queryContext: string) =>
                  ({ queryContext: queryContext } as IChatODSPGenerateQueryContextResult)
              );
            } else {
              return Promise.resolve({ queryContext: '' } as IChatODSPGenerateQueryContextResult);
            }
          case 'handoffODSL':
            if (odslResponseHandler) {
              return odslResponseHandler
                .handleODSLResponse(addMessage, updateMessage, odspCommand.odslResponse)
                .then(() => ({ result: 'success' } as IChatODSPHandoffODSLResult));
            } else {
              return Promise.reject();
            }
          case 'onClick':
            if (interactiveMessages.has(odspCommand.data.id)) {
              const interactiveMessage = interactiveMessages.get(odspCommand.data.id);
              if (interactiveMessage) {
                return interactiveMessage
                  .onClick(odspCommand.data.element, odspCommand.data.payload)
                  .then(() => ({ result: 'success' } as ISuccessResult));
              }
            }
            return Promise.reject();
          default:
            if (props.onCommand) {
              return props.onCommand(odspCommand);
            }
        }
        return Promise.reject();
      }
    );

    const isLoadingRef = React.useRef<boolean>(false);
    const hostRef = React.useRef<IMessenger>();

    React.useEffect(() => {
      if (contentWindow) {
        const url = new URL(chatODSPPageUrl);

        isLoadingRef.current = true;

        iframeRef.current?.setAttribute('aria-busy', 'true');

        const host = createHost({
          initTimeoutMs: 60000,
          channelId,
          origin: url.origin,
          onNotification,
          onCommand,
          identifyParent: true,
          source: contentWindow
        });

        hostRef.current = host;

        (async () => {
          const token = await getAuthToken?.({ url: chatODSPPageUrl });

          const form = contentWindow.document.createElement('form');

          form.setAttribute('method', 'POST');
          form.setAttribute('action', iframeUrl);

          if (token) {
            const idTokenInput = contentWindow.document.createElement('input');
            idTokenInput.setAttribute('type', 'hidden');
            idTokenInput.setAttribute('name', 'access_token');
            idTokenInput.setAttribute('value', token);
            form.appendChild(idTokenInput);
          }

          contentWindow.document.body.appendChild(form);

          form.submit();

          if (iframeRef.current) {
            iframeRef.current.focus();
          }

          await host.ready;

          const chatODSPConfigureCommand: IChatODSPConfigureCommand = {
            command: 'configure',
            options: chatodspOptions || {}
          };

          await host.sendCommand(chatODSPConfigureCommand);

          isLoadingRef.current = false;

          onLoad?.({});

          iframeRef.current?.setAttribute('aria-busy', 'false');

          loadErrorRef.current = undefined;
        })().catch((loadError: Error) => {
          isLoadingRef.current = false;

          iframeRef.current?.setAttribute('aria-busy', 'false');

          if (!loadErrorRef.current) {
            loadErrorRef.current = loadError;
          }

          if (onLoad) {
            onLoad({
              error: loadError
            });
          }
        });

        return () => {
          hostRef.current = undefined;

          host.dispose();
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentWindow]);

    React.useImperativeHandle(
      ref,
      () => ({
        sendCommand: async <TCommand extends ICommand>(
          command: TCommand,
          commandOptions?: ICommandOptions
        ) => {
          const host = hostRef.current;
          if (!host) {
            return {
              result: 'error',
              isExpected: false
            } as IErrorResult;
          }
          return host.sendCommand(command, commandOptions);
        }
      }),
      []
    );

    // Send update theme command when theme change
    React.useEffect(() => {
      (async () => {
        if (hostRef.current && !isLoadingRef.current) {
          const ChatODSPUpdateThemeCommand: IChatODSPUpdateThemeCommand = {
            command: 'updateTheme',
            copilotTheme: v8Theme
              ? createCopilotTheme({ v8Theme, isHighContrast, overrideTheme: options?.theme })
              : undefined,
            themeV8: v8Theme
          };
          await hostRef.current.sendCommand(ChatODSPUpdateThemeCommand);
        }
      })().catch(() => {
        // No-op
      });
    }, [v8Theme, isHighContrast, options?.theme]);

    // Send configuration command when options change
    React.useEffect(() => {
      (async () => {
        if (hostRef.current && !isLoadingRef.current) {
          const ChatODSPConfigureCommand: IChatODSPConfigureCommand = {
            command: 'configure',
            options: chatodspOptions || {}
          };

          await hostRef.current.sendCommand(ChatODSPConfigureCommand);
        }
      })().catch(() => {
        // No-op
      });
    }, [chatodspOptions]);

    addMessage = React.useCallback(
      async (responseMessage: OdspMessage): Promise<void> => {
        if (hostRef.current && !isLoadingRef.current) {
          const addResponseMessageCommand: IAddResponseCommand = {
            command: 'addResponseMessage',
            responseMessage: responseMessage
          };

          if (responseMessage instanceof OdspInteractiveMessage) {
            interactiveMessages.set(responseMessage.id, responseMessage as OdspInteractiveMessage);
            addResponseMessageCommand.responseMessage = new OdspMessage(
              responseMessage.id,
              responseMessage.type,
              responseMessage.data
            );
          }

          await hostRef.current.sendCommand(addResponseMessageCommand);
        }
      },
      [hostRef, isLoadingRef, interactiveMessages]
    );

    updateMessage = React.useCallback(
      async (responseMessage: OdspMessage): Promise<void> => {
        if (hostRef.current && !isLoadingRef.current) {
          const updateResponseMessageCommand: IUpdateResponseCommand = {
            command: 'updateResponseMessage',
            responseMessage: responseMessage
          };

          if (responseMessage instanceof OdspInteractiveMessage) {
            interactiveMessages.set(responseMessage.id, responseMessage as OdspInteractiveMessage);
            updateResponseMessageCommand.responseMessage = new OdspMessage(
              responseMessage.id,
              responseMessage.type,
              responseMessage.data
            );
          }

          await hostRef.current.sendCommand(updateResponseMessageCommand);
        }
      },
      [hostRef, isLoadingRef, interactiveMessages]
    );
    const styles = useStyles();
    return (
      <iframe
        data-automationid='ChatODSPFrame'
        //className="spe-chatodsp-iframe"
        className={styles.frame}
        ref={onIFrameRef}
        onError={onIFrameError}
        title='ChatODSPFrame'
        onLoad={onLoadIframe}
      />
    );
  }
);
