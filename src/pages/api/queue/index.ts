// import { Queue } from "@serverlessq/nextjs";

// export default Queue(
//     "SendNewsletter",
//     "api/queue",
//     async (req, res) => {
//     //   const result = await doSomethingImportant();
//     //   console.log("Queue Job", result);
//       res.send("finished");
//     },
//     { retries: 1, urlToOverrideWhenRunningLocalhost: "https://mock.codes/201" }
//   );