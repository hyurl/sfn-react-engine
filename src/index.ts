import * as path from "path";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { TemplateEngine } from "sfn";

let isTsNode = process.execArgv.join(" ").includes("ts-node");

function isComponent(m): boolean {
    return m && typeof m.prototype.render == "function";
}

export interface ReactProps {
    [name: string]: any;
    i18n?(text: string, ...replacements: string[]): string;
}

export class ReactEngine extends TemplateEngine {
    renderFile(filename: string, vars: { [name: string]: any } = {}): Promise<string> {
        let ext = path.extname(filename),
            basename = path.basename(filename, ext),
            modulePath = path.resolve(path.dirname(filename), basename),
            _filename = modulePath + (isTsNode ? ".tsx" : ".js");

        return new Promise((resolve, reject) => {
            if (!this.options.cache)
                delete require.cache[_filename];

            try {
                resolve(require(modulePath));
            } catch (err) {
                reject(err);
            }
        }).then((_module: any) => {
            if (isComponent(_module.default)) {
                return _module.default;
            } else if (isComponent(_module[basename])) {
                return _module[basename];
            } else if (isComponent(_module)) {
                return _module;
            } else {
                throw new TypeError(`'${filename}' is not a valid component.`);
            }
        }).then(component => {
            return ReactDOMServer.renderToString(
                React.createElement(component, vars)
            );
        });
    }
}