import * as React from "react";
import Instascan from "instascan";
import styled from "styled-components";

const ScannerContainer = styled.div`
  width: 82%;
  border-radius: 1rem;
  margin: auto;
  overflow: hidden;
`;

const ScannerPreview = styled.video`
  width: 82%;
  border-radius: 1rem;
  margin: auto;
  overflow: hidden;
`;

export default class QRCodeScanner extends React.Component {
  scanPreviewElement: HTMLVideoElement;
  state = {
    scannerInstance: null
  };

  componentDidMount() {
    const { onRead } = this.props;
    const newScannerInstance = new Instascan.Scanner({
      video: this.scanPreviewElement,
      mirror: false
    });
    newScannerInstance.addListener("scan", content => {
      newScannerInstance.stop();
      onRead(content);
    });
    Instascan.Camera.getCameras()
      .then(cameras => {
        if (cameras.length > 0) {
          newScannerInstance.start(cameras[0]);
        } else {
          console.error("No cameras found.");
        }
      })
      .catch(e => console.error(e));

    this.setState({ scannerInstance: newScannerInstance });
  }

  componentWillUnmount() {
    const { scannerInstance } = this.state;
    scannerInstance && scannerInstance.stop();
  }

  render() {
    return (
      <ScannerContainer>
        <ScannerPreview ref={ref => (this.scanPreviewElement = ref)} />
      </ScannerContainer>
    );
  }
}
