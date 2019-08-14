const fs = require("fs");
const crypto = require('crypto');

const fileName = "random-bytes.bin";

const fileSizeInBytes = Number.parseInt(process.argv[2]) || 1000;
console.log(`Writing ${fileSizeInBytes} bytes`)

const writer = fs.createWriteStream(fileName)

writetoStream(fileSizeInBytes, () => console.log(`File created: ${fileName}`));

function writetoStream(bytesToWrite, callback) {
    const step = 1000;
    let i = bytesToWrite;
    write();
    function write() {
        let ok = true;
        do {
            const chunkSize = i > step ? step : i;
            const buffer = crypto.randomBytes(chunkSize);

            i -= chunkSize;
            if (i === 0) {
                // Last time!
                writer.write(buffer, callback);
            } else {
                // See if we should continue, or wait.
                // Don't pass the callback, because we're not done yet.
                ok = writer.write(buffer);
            }
        } while (i > 0 && ok);

        if (i > 0) {
            // Had to stop early!
            // Write some more once it drains.
            writer.once('drain', write);
        }
    }
}
