import { enable, disable, setFetchMethod} from "darkreader";

export const checkDarkMode = () => {
    if ((localStorage.getItem('darkMode')) == 'true'){
    setFetchMethod((url) => {
      return fetch(url, {
        mode: 'no-cors',
      });
    });
    enable({
      brightness: 100,
      contrast: 100,
      darkSchemeBackgroundColor: '#181a1b',
      darkSchemeTextColor: '#e8e6e3'
    },);
    } else {
      disable();
    }
  }