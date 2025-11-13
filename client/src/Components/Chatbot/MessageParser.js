class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const messageLowcase = message?.toLowerCase().trim();

    const wordSupports = [
      "ho tro",
      "hotro",
      "hỗ trợ",
      "support",
      "huong dan",
      "hướng dẫn",
      "huongdan",
      "hd",
      "sp",
      "bạn có thể giúp gì tôi",
      "ban co the giup gi toi",
    ];
    if (messageLowcase.includes("chuyến bay")) {
      this.actionProvider.flightsHandler(messageLowcase);
    } else if (wordSupports.some((word) => messageLowcase.includes(word))) {
      this.actionProvider.userManualHandler();
    } else {
      this.actionProvider.userManualHandler();
    }
  }
}

export default MessageParser;
