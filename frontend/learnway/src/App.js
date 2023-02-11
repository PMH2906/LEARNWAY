import React from "react";
import Home from "./component/page/MainPage/Home";
import MyPage from "./component/page/MyPage/MyPage";
import Intro from "./component/page/Front/Intro";
import Login from "./component/page/Front/LoginPage/Login";
import Signup from "./component/page/Front/SignupPage/SignUp";
import FindPwd from "./component/page/Front/FindPassword/FindPwd";
import Loading from "./component/page/Loading/LoadingPage"
import RandomMatch from "./component/page/Loading/RandomMatch"
import Test from "./component/VideoChat/TestPage"
import TestPage from "./component/chat/TestPage"
import GoogleSignup from "./component/page/Front/LoginSocial/GoogleSignup";
import LoginCheck from "./component/page/Front/LoginSocial/LoginCheck";
import PrivateRoute from "./component/page/Front/utils/PrivateRoute";
import OpenV from "./component/VideoChat/VideoChatMain"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const a={
    "aaa@ssafy.com": "bbb@ssafy.com",
    "bbb@ssafy.com":"aaa@ssafy.com"
}
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/test" element={<Test/>}></Route>
                    <Route path="/testchat" element={<TestPage/>}></Route>
                    <Route path="/mypage" element={<MyPage />}></Route>
                </Route>

                <Route path="/loading" element={<Loading />}></Route>
                <Route path="/loading/match" element={<RandomMatch />}></Route>
                <Route path="/intro" element={<Intro />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/find_password" element={<FindPwd />}></Route>
                <Route path="/googlesignup" element={<GoogleSignup />}></Route>
                <Route path='/logincheck' element={<LoginCheck />}></Route>
                <Route path='/openvidu/:sessionId/:myId/:oppoId' element={<OpenV matchData={{sessionId : 'qweriop', myId : 'aaa@ssafy.com', oppoId:'bbb@ssafy.com'}} />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
