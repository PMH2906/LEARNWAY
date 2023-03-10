package com.ssafy.learnway.controller.chat;

import com.ssafy.learnway.domain.friend.Friend;
import com.ssafy.learnway.domain.friend.Room;
import com.ssafy.learnway.domain.user.User;
import com.ssafy.learnway.dto.user.ProfileDto;
import com.ssafy.learnway.dto.chat.ChatMessage;
import com.ssafy.learnway.dto.chat.ChatRoom;
import com.ssafy.learnway.dto.friend.FriendRequestDto;
import com.ssafy.learnway.dto.friend.RoomDto;
import com.ssafy.learnway.repository.chat.ChatRoomRepository;
import com.ssafy.learnway.service.user.UserService;
import com.ssafy.learnway.service.friend.FriendService;
import com.ssafy.learnway.service.friend.RoomService;
import com.ssafy.learnway.util.ResponseHandler;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * STOMP 라이브러리를 이용해서 subscribe(구독자) 구현
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/chat")
public class ChatRoomController {

    private final ChatRoomRepository chatRoomRepository;

    private final FriendService friendService;

    private final UserService userService;

    private final RoomService roomService;

    // 모든 채팅방 목록 반환
    @GetMapping("/room/all/{userEmail}")
    public ResponseEntity rooms(@PathVariable String userEmail) throws SQLException {
        User user = userService.findByEmail(userEmail);
        List<Friend> friends = friendService.list(user); //user의 친구목록

        List<RoomDto> chatRooms = new ArrayList<>();
        for(Friend friend : friends){
            Room room = roomService.findByRelationId(friend);

            User opponent = userService.findById(friend.getUserId().getUserId());
            if(opponent.getUserEmail().equals(userEmail)){
                opponent = userService.findById(friend.getFriendId().getUserId());
            }

            ProfileDto profileDto = userService.getProfile(opponent.getUserEmail());

            if(room!=null){
                chatRooms.add(RoomDto.builder()
                        .relationId(room.getRelationId())
                        .roomId(room.getRoomId())
                        .profileDto(profileDto)
                        .msg(room.getMsg())
                        .dateTime(room.getTime())
                        .build()
                );
            }

            // 시간대 별로 정렬
            Collections.sort(chatRooms);
        }

        if(chatRooms == null || chatRooms.isEmpty()){
            return ResponseHandler.generateResponse("생성된 채팅방이 없습니다", HttpStatus.ACCEPTED);
        }else{
            return ResponseHandler.generateResponse("해당 유저의 모든 채팅방 목록입니다", HttpStatus.OK, "Rooms", chatRooms);
        }
    }

    // 채팅방 생성
    @PostMapping("/room")
    public ResponseEntity createRoom(@RequestBody @Parameter(name = "내 이메일, 채팅 걸 친구 이메일", required = true) FriendRequestDto friendRequestDto) throws SQLException {
        User user = userService.findByEmail(friendRequestDto.getUserEmail());
        User opponent = userService.findByEmail(friendRequestDto.getFriendEmail());
        Friend friend = friendService.findById(user,opponent);

        if(friend == null){
            return ResponseHandler.generateResponse("현재 친구 관계가 아닙니다. 생성하실 수 없습니다.", HttpStatus.ACCEPTED);
        }

        ProfileDto profileDto = userService.getProfile(opponent.getUserEmail());

        Room room = roomService.findByRelationId(friend);

        //이미 채팅방이 존재하고 있는지 확인
        if(room == null){
            ChatRoom chatRoom = chatRoomRepository.createChatRoom();

            roomService.createRoom(friend, chatRoom.getRoomId()); // 최근 온 메시지 별로 정렬하기 위해 저장함 // 이중으로?
            RoomDto roomDto = RoomDto.builder()
                    .roomId(chatRoom.getRoomId())
                    .relationId(friend.getRelationId())
                    .profileDto(profileDto)
                    .build(); // 상대방의 정보만을 가지고 있으면 됨

            return ResponseHandler.generateResponse("채팅방 생성 완료", HttpStatus.OK, "Room", roomDto);

        }else{
            RoomDto roomDto = RoomDto.builder()
                    .roomId(room.getRoomId())
                    .relationId(friend.getRelationId())
                    .profileDto(profileDto)
                    .build(); // 상대방의 정보만을 가지고 있으면 됨
            return ResponseHandler.generateResponse("존재하는 채팅방 전송",HttpStatus.ACCEPTED,"Room", roomDto);
        }
    }

    // 채팅방 파괴
    @DeleteMapping("/room/{roomId}")
    public ResponseEntity deleteRoom(@PathVariable String roomId) {
        Room room = roomService.findByRoomId(roomId);

        if(room != null){
            chatRoomRepository.deleteChatRoom(roomId); //redis
            roomService.deleteByRoomId(roomId); //mysql에 있는 chatRoom도 삭제
            return ResponseHandler.generateResponse("채팅방 삭제 완료", HttpStatus.OK);
        }else{
            return ResponseHandler.generateResponse("검색된 채팅방이 없습니다.", HttpStatus.ACCEPTED);
        }
    }

    // 특정 채팅방 들어갔을때 채팅방 관련 정보를 전달
    @GetMapping("/room/{roomId}")
    public ChatRoom roomInfo(@PathVariable String roomId) {
        return chatRoomRepository.findRoomById(roomId);
    }

    // 해당 채팅방에 저장된 최신 메시지 받기
    @GetMapping("/room/message/{roomId}")
    @ResponseBody
    public List<ChatMessage> getMessages(@PathVariable String roomId) {
        return chatRoomRepository.getMessages(roomId);
    }

}