//Vuetify 라는 UI 라이브러리(css 같은거임) 를 Vue 프로젝트에 등록하는 설정파일
import 'vuetify/styles' //Vuetify 의 기본 css 를 가지고 옴
import { createVuetify } from 'vuetify' //Vuetify 인스턴스를 생성하는 함수(createVuetify) 가지고 오기
import * as components from 'vuetify/components' //Vue 에서 제공하는 모든 UI 컴포넌트 불러오기(ex VBtn, VTextField, VCard, VDialog)

//createVuetify 메서드로 Vuetify 인스턴스 만들기, export 해서 외부에서 사용할수 있게 한다
export default createVuetify(
    {
    components
    }
)