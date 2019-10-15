// Generate required css
import fontAwesome from "react-native-vector-icons/Fonts/FontAwesome.ttf";
import ionicons from "react-native-vector-icons/Fonts/Ionicons.ttf";
const iconFontStyles = `
  @font-face {
    src: url(${fontAwesome});
    font-family: FontAwesome;
  }

  @font-face {
    src: url(${ionicons});
    font-family: Ionicons;
  }
`;

// Create stylesheet
const style = document.createElement("style");
style.type = "text/css";
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);
