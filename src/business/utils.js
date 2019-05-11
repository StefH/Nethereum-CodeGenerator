const path = require('path');

class Utils {
  static sanitizeFilename(contractFilename) {
    return path.basename(contractFilename).replace('.sol', '');
  }

  static sanitizeImport(importStatement) {
    return path.basename(importStatement);
  }
}

export default Utils;
