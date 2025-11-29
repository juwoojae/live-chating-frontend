import {createRouter, createWebHistory} from 'vue-router'
import MemberCreate from "@/views/MemberCreate.vue"
//router 는 ssr 로 따지면 controller 임 view 를 띄워주는 역할을 한다 /home 엔드 포인트 -> homePage 라는  view
//view 는 Vue Component 에 대응된다
const routes = [
    {
        path: '/member/create',
        name: 'MemberCreate',
        component: MemberCreate
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
    }
);

export default router;