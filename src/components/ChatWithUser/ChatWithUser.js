import style from "./ChatWithUser.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { updateChat } from "../../store/ActiveUserSlice";
import { refreshChat, findBuddy, findChat } from "../../server/server";
import Message from "../../classes/Message";
import noPhoto from "../../images/noPhoto.jpg";
import ImagesCarousel from '../DetailedActiveUserCard/ImagesCarousel'
import EmojiPicker from 'emoji-picker-react';
import { GrEmoji } from "react-icons/gr";
import { setChatBuddy } from "../../store/ChatBuddySlice";

export default function ChatWithUser() {

	const dispatch = useDispatch();
	const buddy = useSelector(state => state.chatBuddy);
	let chat = findChat(buddy);
	const toBottomReff = useRef(null)
	const user = useSelector((state) => state.activeUser);
	const [message, setMessage] = useState("");
	const [displayEmojis, setDisplayEmojis] = useState(false)

	const scrollToBottom = () => {
		if(toBottomReff.current){
		return toBottomReff.current.scrollIntoView({ behavior: "smooth" })
		}
	  }

	const addEmoji = (e) => setMessage(message + e.emoji);

	const checkMsgs = ()=>{
		let copyHistory = chat.chatHistory.map(msg => { 
			if(buddy.email === msg.sender){
				msg.seen = true;
			}
            return msg;
        })
        chat.chatHistory = copyHistory;
        dispatch(updateChat([JSON.stringify(findBuddy(buddy.email)), JSON.stringify(chat)]))
	}

	useEffect(scrollToBottom, [message]);

	useEffect(()=>{

		const id = setInterval(() => {
			refreshChat();
			dispatch(setChatBuddy(findBuddy(buddy.email)));
			scrollToBottom();
		}, 3000)

		return ()=> clearInterval(id);
 	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[buddy])

	const handleSendMsg = (e) => {
		e.preventDefault();
		if(message.trim() !== ""){
			const newDate = Date();
			const date = newDate.slice(4, 24);
			const msg = new Message(user.email, message, date, false);
			chat.chatHistory.push(msg);
			dispatch(updateChat([JSON.stringify(buddy), JSON.stringify(chat)]))
			setMessage("");
		}
		setMessage("");
		
	};
	return (
		buddy.username ?
			<div className={style.chatWithUserContainer}>
				<div className={style.chatSection}>
					<div className={style.avatarAndName}>
						<img src={buddy?.pictures[0]?.img || noPhoto} className={style.chatUserProfilePic} alt="buddyPic"></img>
						<span>{buddy.username}</span>
					</div>
					<div onClick={scrollToBottom} className={style.chatMessagesContainer}>
						{chat.chatHistory.map((msg, i) => {
							if (msg.sender === user.email) {
								return (
									<div ref={toBottomReff} key={i} className={style.sentMessageWrap}>
										<span className={style.sentMessage}>
											{msg.text}
										</span>
										<span className={style.sentDate}>
											{msg.date}
										</span>
									</div>
								);
							} else {
								return (
									<div ref={toBottomReff} key={i} className={style.receivedMessageWrap}>
										<span className={style.receivedMessage}>
											{msg.text}
										</span>
										<span className={style.receivedDate}>
											{msg.date}
										</span>
									</div>
								);
							}
						})}
					</div>
					<div className={style.sendMessageSection}>
					<GrEmoji className={style.emojiBtn} onClick={() => setDisplayEmojis(!displayEmojis)}/>
					{displayEmojis ? <div className={style.emojiContainer} onMouseLeave={() => setDisplayEmojis(!displayEmojis)}>
						<EmojiPicker className={style.emojiContainer}
							emojiStyle='native'
							onEmojiClick={(e) => addEmoji(e)}
						/>
						</div> 
					: null}
						<form style={{width:"100%"}} onSubmit={handleSendMsg}>
						<input
							onClick={checkMsgs}
							onChange={(e) => setMessage(e.target.value)}
							value={message}
							className={style.typeMessageInput}
							placeholder={"Type a message"}
						></input>
						<button onClick={handleSendMsg} className={style.sendMessageBtn}>
							Send
						</button>
						</form>
						
					</div>
				</div>
				<div className={style.profileSection}>
					<div className={style.matchedUserProfilePictures}>
						<ImagesCarousel user={buddy} />
					</div>
					<div className={style.profileBasicInfo}>
						<div className={style.nameAge}>
							<span className={style.name}>{buddy.username}</span>
							<span className={style.age}>{buddy.age}</span>
						</div>
						<span>{buddy?.location ? buddy.location : "N/A"}</span>
						<div className={style.matchedUserDescription}>{buddy.description}</div>

					</div>
				</div>
			</div>

		: <div className={style.noChat}>No active chat available</div>
			
	);
}
