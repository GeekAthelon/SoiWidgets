/// <reference path="../../../typings/bluebird/bluebird.d.ts" />

const fs = require('fs');
const path = require('path');
const os = require('os');

export function loadJSONasync<T>(fileName: string): Promise<T> {

   const fullPath = path.resolve(__dirname, '..', fileName);

   console.log('Reading file from', fullPath);

    return new Promise<T>((resolve, reject) => {
    fs.readFile(fullPath, 'utf8', function (err: Error, data: string) {
        if (err) {
            reject(err);
            return;
        }
        resolve(<T> JSON.parse(data));
        });
    });
}

export function loadFakeSoiConfig(fileName: string): Promise<IFakeSoiConfig> {
   const hostname = os.hostname();
    return new Promise<IFakeSoiConfig>((resolve, reject) => {
        loadJSONasync<IFakeSoiConfig[]>(fileName).then(list => {
           const data = list.filter(r => r.name === hostname);
           if (data.length === 1) {
               resolve(data[0]);
           }
           reject(new Error('Could not load config data for: ' + hostname));
        });
    });
}
