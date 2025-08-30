import mongoose from "mongoose"
import config from "./config";
import app from "./app";

main().catch(err => console.log(err));

async function main() {
    try {
        const connect_db = await mongoose.connect(config.db_url as string);
        if (!connect_db) {
            throw new Error()
        }
        app.listen(config.port, () => {
            console.log(`Alhamdulillah app listening on port ${config.port}`)
        })
    }
    catch (err) {
        console.log(err);
    }
}

main()