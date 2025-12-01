<template>
  <!-- Vuetify 컨테이너: 화면 전체 레이아웃을 잡기 위한 기본 박스 -->
  <v-container>
    <!-- 가운데 정렬된 row -->
    <v-row justify="center">
      <v-col cols="12" md="6">
        <!--UI 를 박스형태로 만들어주는 컴포넌트-->
        <v-card>
          <v-card-title class="text-center">
            채팅
          </v-card-title>
          <v-card-text>
            <div class="chat-box" ref="chatBoxRef">
              <div
                  v-for="(msg, index) in message"
                  :key="index"
              >
                {{ msg }}
              </div>
            </div>
            <!--v-model 양방향 데이터 바인딩 문법, 화면 입력 값과 script 에서 선언한 변수가 자동으로 sync 으로 바인딩된다.-->
            <v-text-field
                v-model="newMessage"
                label="메세지 입력"
                @keyup.enter="sendMessage"
            />
            <v-btn color="primary" block @click="sendMessage">전송</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      ws: null,
      message: [],
      newMessage: ""
    }
  },
  created() { //화면이 열리자 마자 웹소켓 연결 엔드포인트 호출
    this.connectWebsocket();
  },
  //화면이 내려가기 직전에 바로 실행하는 훅함수
  beforeUnmount() {
    this.disconnectWebsocket();
  },
  methods: {
    connectWebsocket() {
      this.ws = new WebSocket("ws://localhost:8080/connect"); //Websocket 연결 시도
      //1. 연결이 성공한 경우
      this.ws.onopen = () => {
        console.log("successfully connected!! ");
      }
      //2. 메세지가 들어오면
      this.ws.onmessage = (message) => {
        this.message.push(message.data);  //메세지 배열에 메세지 push
        this.scrollToBottom();
      }
      //3. 연결이 끊기는 경우
      this.ws.onclose = () => {
        console.log("disconnected!! ");
      }
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;
      this.ws.send(this.newMessage);
      this.newMessage = "";
    },
    // 메세지가 띄워짐과 동시에 스크롤이 내려감
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$refs.chatBoxRef; // ref로 DOM 접근
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight; // 맨 아래로 스크롤
        }
      });
    },
    disconnectWebsocket() {
      if (this.ws) {
        this.ws.close(); // 서버단의 웹소켓 핸들러에서 afterConnectionClosed 를 실행한다.
        console.log("disconnected!! ");
        this.ws = null;
      }
    }
  }
}
</script>
<style>
.chat-box {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin: 10px;
}
</style>
