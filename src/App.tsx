import HomePage from "./components/extension/Home";
// import UpgradeToPro from "./components/extension/UpgradeToPro";

const App = () => {
  async function getAudioInputDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter(
      (device) => device.kind === "audioinput"
    );
    console.log("audioInputs", audioInputs); // Logs all audio input devices
    return audioInputs;
  }

  getAudioInputDevices();

  return (
    <div className="w-96">
      {/* <UpgradeToPro /> */}
      <HomePage />
    </div>
  );
};

export default App;
