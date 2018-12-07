"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sfn_1 = require("sfn");
let isTsNode = process.execArgv.join(" ").includes("ts-node");
function isComponent(m) {
    return m && typeof m.prototype.render == "function";
}
class ReactEngine extends sfn_1.TemplateEngine {
    renderFile(filename, vars = {}) {
        let ext = path.extname(filename), basename = path.basename(filename, ext), modulePath = path.resolve(path.dirname(filename), basename), _filename = modulePath + (isTsNode ? ".tsx" : ".js");
        return new Promise((resolve, reject) => {
            if (!this.options.cache)
                delete require.cache[_filename];
            try {
                resolve(require(modulePath));
            }
            catch (err) {
                reject(err);
            }
        }).then((_module) => {
            if (isComponent(_module.default)) {
                return _module.default;
            }
            else if (isComponent(_module[basename])) {
                return _module[basename];
            }
            else if (isComponent(_module)) {
                return _module;
            }
            else {
                throw new TypeError(`'${filename}' is not a valid component.`);
            }
        }).then(component => {
            return ReactDOMServer.renderToString(React.createElement(component, vars));
        });
    }
}
exports.ReactEngine = ReactEngine;
//# sourceMappingURL=index.js.map