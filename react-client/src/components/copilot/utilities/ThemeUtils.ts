//import type { ITheme } from '@fluentui/react-experiments/lib/Styling';
import { ITheme } from '@fluentui/react/lib/Theme';
import { webDarkTheme, webLightTheme } from '@fluentui/tokens';
import type { ICopilotTheme } from '@ms/embed-host-contracts/lib/chatodsp/Options';

export interface ICreateCopilotThemeProps {
  v8Theme: ITheme;
  isHighContrast: boolean;
  overrideTheme?: ICopilotTheme;
}

export function createCopilotTheme({
  v8Theme,
  isHighContrast,
  overrideTheme
}: ICreateCopilotThemeProps): ICopilotTheme {
  const { palette } = v8Theme;
  const isDarkModeEnabled = v8Theme.isInverted;
  const v9Theme = isDarkModeEnabled ? webDarkTheme : webLightTheme;

  const copilotTheme: ICopilotTheme = {
    ...v9Theme,
    isHighContrastModeEnabled: isHighContrast,
    isDarkModeEnabled,
    themePrimary: palette.themePrimary,
    themeSecondary: palette.themeSecondary,
    themeDark: palette.themeDark,
    themeDarkAltTransparent: '#3D91FF00', // v8Theme variable or v9 semantic name?
    themeDarker: palette.themeDarker,
    themeTertiary: palette.themeTertiary,
    themeLight: palette.themeLight,
    themeDarkAlt: palette.themeDarkAlt,
    themeLighter: palette.themeLighter,
    themeLighterTransparent: '#9270FF00', // v8Theme variable or v9 semantic name?
    themeLighterAlt: palette.themeLighterAlt,
    themeLighterAltTransparent: '#6CEBE200', // v8Theme variable or v9 semantic name?
    themeMedium: '#B4D6FA', // v8Theme variable or v9 semantic name?
    themeBackground: isDarkModeEnabled ? '#29292999' : '#FFFFFF99', // the last #99 is 60% opacity
    ...overrideTheme
  };

  return copilotTheme;
}
