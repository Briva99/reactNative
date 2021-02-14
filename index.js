/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

class Main extends Component {
     uiTheme = {
        palette: {
            primaryColor: COLOR.green500,
        },
        toolbar: {
            container: {
                height: 50,
            },
        },
    };
    
     render() {
         return (
          <ThemeContext.Provider value={getTheme(this.uiTheme)}>
            <App />
          </ThemeContext.Provider>
         )
     }
 }

AppRegistry.registerComponent(appName, () => Main);
