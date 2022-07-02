import { useCallback, useEffect, useState } from 'react'
import styles from './HomeContainer.module.css'
import stylesBox from './HomeContainer.viewbox.module.css'
import axios from 'axios'
import moment from 'moment';
import "moment/locale/ko";

const HomeContainer = () => {
    // 전체 확장자 리스트
    const [extension, setExtension] = useState([])
    // 확장자 입력 키워드
    const [keywords, setKeywords] = useState('');

    // 고정 확장자 리스트
    const fixedExtension = ['bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js']
    // 커스텀 확장자 리스트
    const customExtension = extension.filter((item)=>fixedExtension.includes(item) == false)

    // 차단할 확장자 서버에서 불러오는 함수
    const getExtension = useCallback(async() => {
        // call api
        const res = await axios.get("extension/read")
            .catch(error => console.error('this is error' + error));
        
        // 서버에서 받아온 데이터 전체 확장자 리스트에 id만 배열로 담음
        setExtension(res.data.map(item=>(item.id)))
    }, [])

    // 확장자 입력 함수
    const inputExtension = async(ex) => {

        // 객체로 만들어서 넘김
        const param = {id: ex, createDateTime: moment().format('YYYYMMDDHHmmss')}

        // call api
        const res = await axios.post("extension/create", param)
            .catch(error => console.error('this is error' + error));

        // 입력한 후 조회함
        getExtension()
    }

    // 확장자 삭제 함수
    const deleteExtension = async(ex) => {
        // call api
        const res = await axios.delete("extension/delete/" + ex)
            .catch(error => console.error('this is error' + error));
        
        // 삭제 후 조회함
        getExtension()
    }

    // 체크박스 클릭 시 발생하는 함수
    const onCheckedCheckbox = useCallback(
        (checked, list) => {
            if(checked) {
                inputExtension(list)
            }
            else {
                deleteExtension(list)
            }
        }
    )

    // 확장자 체크박스에 체크하고 리스팅박스에 출력하는 함수
    const CustomExtensionBox = ({ex}) => {
        return (
            <div className={stylesBox.custom_extension_box}>
                <div className={stylesBox.custom_extension_box_left}>
                    {ex}
                </div>
                <div className={stylesBox.custom_extension_box_right}>
                    <div className={stylesBox.cancel_box} onClick={() => deleteExtension(ex)}/>
                </div>
            </div>
        )
    }    

    // 텍스트 입력 시 상태 저장
    const onChangeText = (e) => {
        setKeywords(e.target.value);
    };

    // 최초 실행 시 db에서 데이터 불러옴
    useEffect(() => {
        getExtension()
    }, [getExtension])

    return(
        <div className={styles.container}>
            <div className={styles.left}>
            </div>
            <div className={styles.center}>
                <div className={styles.center_fixed_extension}>
                    <div className={styles.center_fixed_extension_title}>
                        <h3>고정 확장자</h3>
                    </div>
                    <div className={styles.center_fixed_extension_contents}>
                        {fixedExtension.map((list) => (
                            <a>
                                <input 
                                    key={list}
                                    type='checkbox'
                                    checked={extension.includes(list) ? true : false}
                                    onChange={(e) => onCheckedCheckbox(e.target.checked, list)} />
                                {list}
                            </a>
                        ))}
                    </div>
                </div>
                <div className={styles.center_custom_extension}>
                    <div className={styles.center_custom_extension_title}>
                        <h3>커스텀 확장자</h3>
                    </div>
                    <div className={styles.center_custom_extension_contents}>
                        <input type="text" value={keywords} onChange={onChangeText}></input>
                        <button onClick={() => {
                            if(fixedExtension.includes(keywords)) {
                                alert('고정 커스텀 확장자는 추가할 수 없습니다.')
                            } else if(extension.includes(keywords)) {
                                alert('이미 등록된 확장자는 추가할 수 없습니다.')
                            }
                            else {
                                if(keywords.length > 20) {
                                    alert('확장자의 최대입력 길이를 초과하였습니다.')
                                } else if(customExtension.length > 200) {
                                    alert('고정 커스텀 확장자는 최대 200개까지 추가 가능합니다.')
                                } else {
                                    inputExtension(keywords)
                                    setKeywords('')
                                }
                            }
                        }}>추가</button>
                    </div>
                </div>
                <div className={styles.center_extension_view}>
                    <div className={styles.center_extension_view_title}>
                    </div>
                    <div className={styles.center_extension_view_contents}>
                        <div className={styles.center_extension_view_contents_viewbox}>
                            <div className={styles.center_extension_view_contents_viewbox_title}>
                                {customExtension.length}/200
                            </div>
                            <div className={styles.center_extension_view_contents_viewbox_list}>
                                {customExtension.map((list)=>(<CustomExtensionBox ex={list} />))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
            </div>
        </div>
    )
}




export default HomeContainer