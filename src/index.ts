import cluster from "node:cluster";
import runApp from "./runApp";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

if (cluster.isPrimary) {
  cluster.fork();

  // If for some reason the app shuts down, restart it
  // Wait 20s to prevent an infinite restart that kills the pi
  cluster.on("exit", async (workerId, code, signal) => {
    console.log(
      `Worker ${workerId} died with code ${code} and signal ${signal}`
    );

    await sleep(20 * 1000);

    cluster.fork();
  });

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
} else {
  runApp();
}
