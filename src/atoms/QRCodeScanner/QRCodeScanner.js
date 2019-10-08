import QRCodeScanner from "react-native-qrcode-scanner";

const QRCodeScanner = ({ onRead }) => (
  <QRCodeScanner
    cameraProps={{ ratio: "1:1", captureAudio: false }}
    fadeIn={false}
    onRead={e => onRead(e.data)}
    cameraStyle={{
      // padding 16 for each side
      height: Dimensions.get("window").width - 32,
      width: Dimensions.get("window").width - 32
    }}
  />
);

export default QRCodeScanner;
