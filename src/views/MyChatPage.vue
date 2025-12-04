<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-center text-h5">내 채팅 목록</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
              <tr>
                <th>채팅방 이름</th>
                <th>읽지 않은 메시지</th>
                <th>액션</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="chat in chatList" :key="chat.roomId">
                <td>{{ chat.roomName }}</td>
                <td>{{ chat.unReadCount }}</td>
                <td>
                  <v-btn color="primary" @click="enterChatRoom(chat.roomId)">입장</v-btn>
                  <!--1대 1 채팅인경우 나가기 버튼 비활성화-->
                  <v-btn color="secondary" :disabled="chat.isGroupChat === 'N'" @click="leaveChatRoom(chat.roomId)">나가기</v-btn>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      chatList: []
    }
  }
  ,
  async created() {
    this.load();
  },
  methods: {
    //StompChatPage 로 라우팅 하기
    enterChatRoom(roomId) {
      this.$router.push(`/chatpage/${roomId}`);
    },
    async leaveChatRoom(roomId) {
      await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/chat/room/group/${roomId}/leave`);   //서버단에서 단톡방 나기기
      this.chatList = this.chatList.filter((chat) => chat.roomId === roomId);  // 내가 나가고자 선택한 roomId 를 제외한 내 채팅방 list 만들기
      this.load();//화면 리로드 하기
    },//화면 리로드 하기
    async load(){
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/chat/my/rooms`);  // 내 채팅방 조회
      console.log(response);
      this.chatList = response.data; //axios 는 parsing 까지 해준다
    }
  }
}
</script>