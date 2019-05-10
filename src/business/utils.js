const path = require('path');

class Utils {
  static sanitizeFilename(contractFilename) {
    return path.basename(contractFilename).replace('.sol', '');
  }
}

export default Utils;
