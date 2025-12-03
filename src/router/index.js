import {createRouter, createWebHistory} from 'vue-router'
import MemberCreate from "@/views/MemberCreate.vue"
import LoginPage from "@/views/LoginPage.vue"
import MemberList from "@/views/MemberList.vue"
import SimpleWebsocket from "@/views/SimpleWebsocket.vue"
import StompChatPage from "@/views/StompChatPage.vue"
import GroupChattingList from "@/views/GroupChattingList.vue"
//router 는 ssr 로 따지면 controller 임 view 를 띄워주는 역할을 한다 /home 엔드 포인트 -> homePage 라는  view
//view 는 Vue Component 에 대응된다
const routes = [
    {
        path: '/member/create',
        name: 'MemberCreate',
        component: MemberCreate
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/member/list',
        name: 'MemberList',
        component: MemberList
    },
    {
        path: '/simple/chat',
        name: 'SimpleWebsocket',
        component: SimpleWebsocket
    },
    {
        path: '/chatpage/:roomId',
        name: 'StompChatPage',
        component: StompChatPage
    },
    {
        path: '/groupchatting/list',
        name: 'GroupChattingList',
        component: GroupChattingList
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
    }
);

export default router;