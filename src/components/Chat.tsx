import { useGoogleLogin } from "@react-oauth/google";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { useState } from "react";
import "./Chat.scss";
import { mutateElement } from "../element/mutateElement";
import { NonDeletedExcalidrawElement } from "../element/types";

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * This isn't quite the proper way to do this; this is totally a hack, but for the
 * purposes of the D20 project, it's fine.
 */
let googleLogin: () => void = () => {};

function setAttribute(attribute: string, value: any) {
  const selectedElementIds =
    window.collab.excalidrawAPI.getAppState().selectedElementIds;

  const modified = window.collab.excalidrawAPI
    .getSceneElements()

    .map((element) => {
      if (element?.locked) {
        return mutateElement(element, {
          locked: false,
        });
      }

      if (element.id in selectedElementIds && !element.customData?.locked) {
        if (typeof value === "function") {
          return mutateElement(element, {
            locked: false,
            customData: value(element),
          });
        }

        return mutateElement(element, {
          locked: false,
          customData: {
            ...element.customData,
            [attribute]: value,
          },
        });
      }

      return mutateElement(element, {}, false);
    });

  window.collab.excalidrawAPI.updateScene({
    elements: modified,
  });

  window.collab.queueBroadcastAllElements();

  return Object.keys(selectedElementIds).length;
}

function take([username = window.collab.state.username] = [] as string[]) {
  const user = username === "all" ? null : username;

  const count = setAttribute("user", user);
  window.collab.excalidrawAPI.addMessage({
    name: "System",
    message: `${username} has taken control of the ${count} selected element(s)`,
  });
}

function roll(args: string[], dm = false) {
  args = args
    .join(" ")
    .replace(/\+|-|\(|\)/g, (i) => ` ${i} `)
    .split(" ");

  // lets make it so that it performs multiple rolls,

  // All attributes
  const set: Set<string> = new Set([]);

  // lets grab the custom data from selected elements
  const data = window.collab.excalidrawAPI
    .getSceneElements()
    .filter(
      (element) =>
        element.id in
        window.collab.excalidrawAPI.getAppState().selectedElementIds,
    );

  const elements: Record<string, Record<string, any>> = {};

  for (const element of data) {
    for (const key of Object.keys(element.customData! || {})) {
      set.add(key);
    }

    elements[element.groupIds[0] || element.id] = element.customData || {};
  }

  const argsJoined = args.join(" ");
  if (
    Array.from(set).some((i) => {
      return argsJoined.includes(i);
    })
  ) {
    const messages = [];
    // We will perform multiple rolls
    let count = 0;
    for (const element in elements) {
      const el = elements[element];
      // if (!args.some((i) => i in el)) {
      //   continue;
      // }

      let notation = args
        .map((i) => {
          if (i in el) {
            return (el[i] || "").toString().replace(/^\+/g, "");
          }
          if (i === "disadvantage") {
            return "2d20kl1";
          }
          if (i === "advantage") {
            return "2d20kh1";
          }
          return i;
        })
        .join(" ");

      for (const key in el) {
        notation = notation
          .replace(
            new RegExp(key, "g"),
            (el[key] || "").toString().replace(/^\+/g, ""),
          )
          .replace(/\s*\(\s*/g, "(")
          .replace(/\s*\)\s*/g, ")");
      }

      notation = `${notation
        .replace(/\s*\(\s*/g, "(")
        .replace(/\s*\)\s*/g, ")")}`;
      const dice = new DiceRoll(notation);

      messages.push({
        name: window.collab.state.username,
        message: `[${el.name || (count++).toString()}] ${dice.output}`,
        type: "roll" as "roll",
        to: dm ? "dm" : undefined,
      });
    }
    window.collab.excalidrawAPI.addMessages(messages);

    (async function () {
      for (const message of messages) {
        await timeout(100);
        window.collab.portal.sendChatMessage(
          message.message,
          message.type,
          message.to,
        );
      }
    })();

    return;
  }

  const notation = args
    .map((i) => {
      if (i === "disadvantage") {
        return "2d20kl1";
      }
      if (i === "advantage") {
        return "2d20kh1";
      }
      return i;
    })
    .join(" ")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")");

  const dice = new DiceRoll(notation);

  window.collab.excalidrawAPI.addMessage({
    name: window.collab.state.username,
    message: dice.output,
    type: "roll",
    to: dm ? "dm" : undefined,
  });

  // Yes, this does broadcast to everyone. We can improve back-end security later.
  window.collab.portal.sendChatMessage(
    dice.output,
    "roll",
    dm ? "dm" : undefined,
  );
}

function whisper(args: string[]) {
  let [username, ...message] = args;

  if (username === "gm") {
    username = "dm";
  }

  if (message.join(" ").trim() === "") {
    return;
  }

  window.collab.portal.sendChatMessage(message.join(" "), "message", username);
  window.collab.excalidrawAPI.addMessage({
    name: window.collab.state.username,
    message: message.join(" "),
    to: username,
  });
}

const commands: Record<string, (args: string[]) => void> = {
  help() {
    window.collab.excalidrawAPI.addMessage({
      name: "System",
      message: `Supported commands are: ${Object.keys(commands).join(", ")}`,
    });
  },
  roll,
  dmroll: (args) => roll(args, true),
  gmroll: (args) => roll(args, true),
  clear() {
    window.collab.excalidrawAPI.clearMessages();
  },
  login() {
    googleLogin();
  },
  claim([username = window.collab.state.username] = []) {
    window.collab.setDM(username);
    window.collab.portal.setDM(username);
    window.collab.excalidrawAPI.addMessage({
      name: "System",
      message: `${username} is now the DM`,
    });
  },
  take,
  give: take,
  whisper,
  w: whisper,
  set: (args) => {
    const [attribute, ...value] = args;
    setAttribute(attribute, value.join(" "));
  },
  setr: (args) => {
    const [attribute, ...rpgDice] = args;
    const record = {} as Record<string, any>;
    setAttribute(attribute, (element: NonDeletedExcalidrawElement) => {
      const group = element.groupIds[0] ?? element.id;

      if (!record[group]) {
        record[group] = new DiceRoll(rpgDice.join(" ")).total;
      }

      return {
        ...element.customData,
        [attribute]: record[group],
      };
    });
  },
  unset: (args) => {
    const [attribute] = args;
    setAttribute(attribute, (element: NonDeletedExcalidrawElement) => {
      const custom = { ...element.customData };
      delete custom[attribute];
      return custom;
    });
  },
  mod: (args) => {
    const [attribute, ...value] = args;
    setAttribute(attribute, (element: NonDeletedExcalidrawElement) => {
      const current = element.customData?.[attribute] || 0;
      const val = new DiceRoll(value.join(" ").replace(/^-/, "0-")).total;
      return {
        ...element.customData,
        [attribute]: +current + val,
      };
    });
  },
};

function parseCommand(command: string) {
  // first character starts with a "/",
  // so we need to remove it
  const commandWithoutSlash = command.substring(1);
  const [commandName, ...args] = commandWithoutSlash.split(" ");

  if (commands[commandName]) {
    return commands[commandName](args);
  }

  throw new Error("Command not found");
}

export function Chat({
  messages,
}: {
  messages: {
    name: string;
    message: string;
    type: "message" | "roll";
    to?: string;
  }[];
}) {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  const [historyPosition, setHistoryPosition] = useState<number>(0);

  googleLogin = useGoogleLogin({
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token || "");
    },
    scope: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ].join(" "),
  });

  function sendMessage() {
    const messageToSend = message.trim();

    if (!messageToSend) {
      return;
    }

    if (messageToSend.startsWith("/")) {
      setMessage("");

      try {
        parseCommand(messageToSend);
      } catch (e: any) {
        window.collab.excalidrawAPI.addMessage({
          name: "System",
          message: e.message,
        });
      }

      return;
    }

    window.collab.portal.sendChatMessage(messageToSend);
    window.collab.excalidrawAPI.addMessage({
      name: window.collab.state.username,
      message: messageToSend,
    });
    setMessage("");
  }

  return (
    <>
      <div
        className="ChatBox"
        onClick={() => {
          // focus on the input when the chat box is clicked
          // @ts-expect-error This is actually fine.
          document.querySelector(".ChatBox input")?.focus();
        }}
      >
        {messages.map((message, index) => {
          if (message.type === "roll") {
            return (
              <div key={index}>
                <span className="ChatBox__name">{message.name}</span>
                {message.to ? "privately " : ""} rolled:
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="ChatBox__message">{message.message}</span>
              </div>
            );
          }

          return (
            <div key={index}>
              <span className="ChatBox__name">
                {message.name}
                {message.to ? <i>&nbsp;(whispered)</i> : <></>}:
              </span>
              <span className="ChatBox__message">{message.message}</span>
            </div>
          );
        })}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              // set message history to the past 50
              setMessageHistory([...messageHistory, message].slice(-50));
              setHistoryPosition(0);
            }
            if (e.key === "ArrowUp") {
              setHistoryPosition(
                Math.min(historyPosition + 1, messageHistory.length),
              );
              setMessage(
                messageHistory[messageHistory.length - historyPosition - 1],
              );
            }
            if (e.key === "ArrowDown") {
              setHistoryPosition(Math.max(0, historyPosition - 1));
              setMessage(
                messageHistory[messageHistory.length - historyPosition - 1],
              );
            }
          }}
        />
      </div>
    </>
  );
}
