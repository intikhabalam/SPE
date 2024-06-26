import { Job } from "../model/Job";
import { useState } from "react";
import { GraphProvider } from "../providers/GraphProvider";
import {
  Body1,
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Tag,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import {
  ArrowReplyRegular,
  ContentView16Regular,
  Note16Regular,
  MegaphoneLoud16Regular,
  Pen16Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  card: {
    ...shorthands.margin("20px"),
    width: "720px",
    maxWidth: "100%",
  },
});

export const ViewJobApplicants: React.FC<{ job?: Job }> = ({ job }) => {
  const [showOfferDialog, setShowOfferDialog] = useState<boolean>(false);
  const editInterviewNotes = async () => {
    const name = "notes.docx";
    const items = await GraphProvider.instance.listItems(job?.id!);
    const item = items.find((item) => item.name === name);
    if (item) {
      window.open(item.webUrl, "_blank");
    }
  };
  const previewResume = async () => {
    const name = "resume.pdf";
    const items = await GraphProvider.instance.listItems(job?.id!);
    const item = items.find((item) => item.name === name);
    if (item) {
      const url = await GraphProvider.instance.getPreviewUrl(job?.id!, item.id);
      window.open(url, "_blank");
    }
  };
  const styles = useStyles();
  return (
    <div style={{ padding: "20px" }}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <Body1>
              <b>Alex Wilber</b> applied about 4 weeks ago
            </Body1>
          }
          description={
            <Caption1>
              Status:{" "}
              <Tag appearance="brand" size="extra-small">
                Ready for offer
              </Tag>
            </Caption1>
          }
        ></CardHeader>
        <CardFooter>
          <Button
            onClick={() => setShowOfferDialog(true)}
            appearance="primary"
            size="small"
            icon={<MegaphoneLoud16Regular />}
          >
            Send Offer
          </Button>
          <Button
            onClick={() => editInterviewNotes()}
            size="small"
            icon={<Note16Regular />}
          >
            View Interview Notes
          </Button>
          <Button
            onClick={() => previewResume()}
            size="small"
            icon={<ContentView16Regular />}
          >
            View Resume
          </Button>
          <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>
            Contact
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showOfferDialog}>
        <DialogSurface>
          <DialogTitle>Offer Sent</DialogTitle>
          <DialogContent>
            <p>Offer letter has been sent to Alex Wilber.</p>
          </DialogContent>
          <DialogActions>
            <Button appearance="primary">OK</Button>
          </DialogActions>
        </DialogSurface>
      </Dialog>

      <Card className={styles.card}>
        <CardHeader
          header={
            <Body1>
              <b>Nestor Wilke</b> applied about 4 weeks ago
            </Body1>
          }
          description={
            <Caption1>
              Status:{" "}
              <Tag appearance="brand" size="extra-small">
                Interviewed
              </Tag>
            </Caption1>
          }
        ></CardHeader>
        <CardFooter>
          <Button size="small" icon={<Pen16Regular />}>
            Create Offer
          </Button>
          <Button size="small" icon={<Note16Regular />}>
            View Interview Notes
          </Button>
          <Button size="small" icon={<ContentView16Regular />}>
            View Resume
          </Button>
          <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>
            Contact
          </Button>
        </CardFooter>
      </Card>

      <Card className={styles.card}>
        <CardHeader
          header={
            <Body1>
              <b>Lynne Robbins</b> applied about 2 weeks ago
            </Body1>
          }
          description={
            <Caption1>
              Status:{" "}
              <Tag appearance="brand" size="extra-small">
                Rejected
              </Tag>
            </Caption1>
          }
        ></CardHeader>
        <CardFooter>
          <Button size="small" icon={<ContentView16Regular />}>
            View Resume
          </Button>
          <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>
            Contact
          </Button>
        </CardFooter>
      </Card>

      <Card className={styles.card}>
        <CardHeader
          header={
            <Body1>
              <b>Lee Gu</b> applied about 5 days ago
            </Body1>
          }
          description={
            <Caption1>
              Status:{" "}
              <Tag appearance="brand" size="extra-small">
                Applied
              </Tag>
            </Caption1>
          }
        ></CardHeader>
        <CardFooter>
          <Button size="small" icon={<ContentView16Regular />}>
            View Resume
          </Button>
          <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>
            Contact
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
