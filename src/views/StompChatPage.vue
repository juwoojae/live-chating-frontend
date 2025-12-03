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
                  :class="['chat-message', msg.senderEmail === this.senderEmail ? 'sent' : 'received']"
              >
                <strong>{{ msg.senderEmail }}: </strong> {{msg.message}}
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
import axios from "axios";
//import axios from "axios";

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
      stompClient: null,
      token: "",
      senderEmail: null,
      roomId: null
    }
  },
  async created() { //화면이 열리자 마자 웹소켓 연결 엔드포인트 호출
    this.senderEmail = localStorage.getItem("email");
    this.roomId = this.$route.params.roomId;
    const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/chat/history/${this.roomId}`);
    this.messages = response.data;
    this.connectWebsocket();
  },
  // 사용자가 현재 라우트에서 다른 라우트로 이동하려고 할때 호출되는 훅함수
  beforeRouteLeave(to, from, next){
    this.disconnectWebsocket();
    next()
  },
  //화면을 완전히 꺼버렸을때
  beforeUnmount() {
    this.disconnectWebsocket();
  },
  methods: {
    connectWebsocket() {
      if(this.stompClient && this.stompClient.connected) return;
      // sockjs 는 http 엔드포인트를 사용한다, websocket 을 내장한 향상된 js 라이브러리
      const sockJs = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/connect`)
      this.stompClient = Stomp.over(sockJs); //SockJS 객체를 이용해서 stomp 객체로 만들어야 한다
      this.token = localStorage.getItem('token');
      //연결 요청
      this.stompClient.connect({
            Authorization: `Bearer ${this.token}`
          }, //1 room 을 구독함, 메세지가 서버에서 1 room 으로 들어오면 콜백이 자동 실행된다
          () => {
            this.stompClient.subscribe(`/topic/${this.roomId}`, (message) => {
              console.log("요거는 {} ", message);
              const paresMessage = JSON.parse(message.body);
              this.messages.push(paresMessage);
              this.scrollToBottom();
            })
          }
      );
    },
    // 누가 보냈는지 알수 없으므로 json 형식으로 email: , message: 형식으로 보내자.
    sendMessage() {
      if (this.newMessage.trim() === "") return;
      const message = {
        senderEmail: this.senderEmail,
        message: this.newMessage
      }
      this.stompClient.send(`/publish/${this.roomId}`, JSON.stringify(message));  //axios 가 아니므로 json 형태로 변환 해야한다.
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
      if(this.stompClient && this.stompClient.connected){
        this.stompClient.unsubscribe(`/topic/${this.roomId}`);
        this.stompClient.disconnect();
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

.chat-message {
  margin-bottom: 10px;
}

.sent{
  text-align: right;
}
.received{
  text-align: left;
}
</style>

