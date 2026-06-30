import React from "react";

export type RecordingInfo = {
  patientName: string;
  template: string;
  visitType: string;
};

type RecordingContextType = {
  startRecording: (info: RecordingInfo) => void;
};

export const RecordingContext = React.createContext<RecordingContextType>({
  startRecording: () => {},
});
