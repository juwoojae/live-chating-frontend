<template>
  <v-container>
    <v-row justify="center" >
      <v-col cols="12" sm="4" md="6">
        <v-card>
          <v-card-title class="test-h5 text-center">회원가입</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="memberCreate">
              <v-text-field
                label="이름"

                v-model="name"
                aria-required="true"
              >
              </v-text-field>
              <v-text-field
                  label="email"
                  v-model="email"
                  type="email"
                  aria-required="true"
              >
              </v-text-field>
              <v-text-field
                  label="password"
                  v-model="password"
                  type="password"
                  aria-required="true"
              >
              </v-text-field>
              <v-btn type="submit" color="primary" block>등록</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data(){
    return{
      name: "",
      email: "",
      password: "",
    }
  },
  methods: {
    async memberCreate(){
      //이렇게 하면 자동으로 json 으로 변환
      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
      }
      //axios 는 시간이 좀 걸려서 비동기로 주로 씀
      alert(`${process.env.VUE_APP_API_BASE_URL}/member/create 로 이동`)
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member/create`,data);
      this.$router.push({ path: "/" });
    }
  }

}
</script>