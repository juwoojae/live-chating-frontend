import { createApp } from 'vue' //Vue 애플리케이션을 만들기 위한 함수 import
import App from './App.vue'  //Vue 애플리케이션의 최상위 컴포넌트 가지고 오기
import vuetify from './plugins/vuetify' //방금 만든 Vuetify 설정 파일 불러오기
import router from '@/router/index.js' //
//import axios from 'axios'

const app = createApp(App) //Vue 애플리케이션 인스턴스 생성

app.use(router) //앱에 Vue Router 를 추가 (페이지 이동기능 활성화)
app.use(vuetify)  //앱에 Vuetify UI 활성화
app.mount('#app')   //Vue 앱을 html dom 에 붙인다.
