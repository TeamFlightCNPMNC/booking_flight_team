import { createChatBotMessage } from "react-chatbot-kit";
import Flights from "./Flights";
import Options from "./Options";
import UserManual from "./UserManual";

const config = {
  initialMessages: [
    createChatBotMessage(
      `Xin chào, tôi là trợ lý của travfuit, tôi có thể giúp gì cho bạn?`
    ),
  ],
  botName: "TRAVFRUIT",
  customComponents: {},
  state: {
    flights: [],
    // lastMessage: "",
  },
  widgets: [
    {
      widgetName: "flights",
      widgetFunc: (props) => {
        console.log(props);

        return <Flights {...props} flights={props.state.flights} />;
      },
      mapStateToProps: ["flights"],
      // mapStateToProps: ["flights", "lastMessage"],
    },
    {
      widgetName: "options",
      widgetFunc: (props) => <Options {...props} />,
    },
    {
      widgetName: "usermanual",
      widgetFunc: (props) => <UserManual {...props} />,
    },
  ],
};

export default config;
