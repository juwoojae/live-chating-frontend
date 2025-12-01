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
                  v-for="(msg, index) in messages"
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
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
//import axios from "axios";

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
      stompClient: null,
      token: ""
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
      // sockjs 는 http 엔드포인트를 사용한다, websocket 을 내장한 향상된 js 라이브러리
      const sockJs = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/connect`)
      this.stompClient = Stomp.over(sockJs); //SockJS 객체를 이용해서 stomp 객체로 만들어야 한다
      this.token = localStorage.getItem('token');
      //연결 요청
      this.stompClient.connect({
            Authorization: `Bearer ${this.token}`
          },
          () => {
            this.stompClient.subscribe(`/topic/1`, (message) => {
              console.log(message);
              this.messages.push(message.body);
              this.scrollToBottom();
            })
          }
      );
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;
      this.stompClient.send(`/publish/1`, this.newMessage);  //메세지를 1 번 room 에 발송한다
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
      // if (this.ws) {
      //   this.ws.close(); // 서버단의 웹소켓 핸들러에서 afterConnectionClosed 를 실행한다.
      //   console.log("disconnected!! ");
      //   this.ws = null;
      // }
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

