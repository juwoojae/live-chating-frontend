import { createApp } from 'vue' //Vue 애플리케이션을 만들기 위한 함수 import
import App from './App.vue'  //Vue 애플리케이션의 최상위 컴포넌트 가지고 오기
import vuetify from './plugins/vuetify' //방금 만든 Vuetify 설정 파일 불러오기
import router from '@/router/index.js' //
import axios from 'axios'

// axios 요청(Request)을 가로채서 추가 작업을 할 수 있게 해주는 기능 (인터셉터)
axios.interceptors.request.use(

    // 요청이 서버로 보내지기 "바로 직전에" 실행되는 함수
    config => {

        // 로컬스토리지에서 토큰 가져오기 (로그인 시 저장해둔 JWT)
        const token = localStorage.getItem('token');

        // 만약 토큰이 존재하면
        if (token) {
            // 요청 헤더에 Authorization 추가 (Spring Security가 읽는 부분)
            // 서버에는 "Authorization: Bearer {토큰}" 형태로 전송됨
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 수정 또는 추가된 config 객체를 반드시 return 해야 함
        // 그래야 axios가 이 config로 요청을 계속 진행함
        return config;
    },

    // 요청 구성(config) 중 에러가 발생했을 때 실행되는 부분
    error => {
        // Promise.reject를 return하면
        // axios는 이 에러를 호출한 곳으로 던짐
        // 즉, 인터셉터를 무시하고 원래 에러 처리를 이어감
        return Promise.reject(error);
    }
);


const app = createApp(App) //Vue 애플리케이션 인스턴스 생성

app.use(router) //앱에 Vue Router 를 추가 (페이지 이동기능 활성화)
app.use(vuetify)  //앱에 Vuetify UI 활성화
app.mount('#app')   //Vue 앱을 html dom 에 붙인다.
