import { useCallback, useEffect, useState } from 'react'
import styles from './HomeContainer.module.css'
import stylesBox from './CustomExtensionBox.module.css'
import axios from 'axios'
import moment from 'moment';
import "moment/locale/ko";

const HomeContainer = () => {
    const [extension, setExtension] = useState([])
    const [fixedExtension, setFixedExtension] = useState(['bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js'])
    //const [customExtension, setCustomExtension] = useState([])
    const [keywords, setKeywords] = useState('');
    const customExtension = extension.filter((item)=>fixedExtension.includes(item) == false)

    // 차단할 확장자 서버에서 불러오는 함수
    const getExtension = useCallback(async() => {
        // call api
        const res = await axios.get("extension/read")
            .catch(error => console.error('this is error' + error));
        
        setExtension(res.data.map(item=>(item.id)))
    }, [])


    const inputExtension = async(ex) => {

        const param = {id: ex, createDateTime: moment().format('YYYYMMDDHHmmss')}

        // call api
        const res = await axios.post("extension/create", param)
            .catch(error => console.error('this is error' + error));

        getExtension()
    }

    const deleteExtension = async(ex) => {
        // call api
        const res = await axios.delete("extension/delete/" + ex)
            .catch(error => console.error('this is error' + error));
            
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

    // 텍스트 입력 시 상태 저장
    const onChangeText = (e) => {
        setKeywords(e.target.value);
    };

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