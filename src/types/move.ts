export enum EMoveFields {
  MOVE_ID = "moveId",
  CATEGORY = "category",
  U3 = "u3",
  USER = "user",
  GROUP = "group",
  TYPE = "type",
  TARGET = "target",
  U8 = "u8",
  GAUGE_DRAIN = "gaugeDrain",
  POWER = "power",
  ACCURACY = "accuracy",
  USES = "uses",
  TAGS = "tags"
}

export interface IMove {
  [EMoveFields.MOVE_ID]: number;
  [EMoveFields.CATEGORY]: string;
  [EMoveFields.U3]: number;
  [EMoveFields.USER]: string;
  [EMoveFields.GROUP]: string;
  [EMoveFields.TYPE]: number;
  [EMoveFields.TARGET]: string;
  [EMoveFields.U8]: number;
  [EMoveFields.GAUGE_DRAIN]: number;
  [EMoveFields.POWER]: number;
  [EMoveFields.ACCURACY]: number;
  [EMoveFields.USES]: number;
  [EMoveFields.TAGS]: string;
}

export interface IMoveApiResponse {
  entries: IMove[];
}
