import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import styled from "styled-components";
import {request} from '../../page/Front/utils/axios'
import CommonFrame from "../CommonComponent/CommonFrame";
import Title from "../CommonComponent/CommonTitle";
import TFBtnSet from "../CommonComponent/TFBtnSet";
import "./externalCss/CheckBoxCss.css";

const Frame = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    // height:42vw;
`;

const PreInput = styled.input`
    // width:${props => props.inputWidth || '2vw'};
    width: 5.2vw;
    height:2.5vw;
    // font-size:1.5vw;

    &:focus{
        outline:none;
    }
    
    text-align: center;
    border:none;
    color:#9B8383
`;

const PreInputGroup = styled.div`
    // width:22vw;
    // height:inherit;
    height:1vw;

    display:flex;
    flex-direction:row;
    display: -webkit-flex;
    justify-content:space-between;
    justify-content: flex-end;
`;

const ChkBoxGroup = styled.div`
    width:inherit;
    height:inherit;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    // padding : 1vw;
`;

const LargeInput = styled.textarea`
    width: 100%;
    border: none;
    resize: none;
    font-family: 'Raleway', sans-serif;
    text-align: center;

    &:focus{
        outline:none;
    }
`;

const Label = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 1vw;
    text-align: center;
    height: 5vw;
    vertical-align: middle;
    
    // background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 7%);
    overflow: hidden;
    text-transform: uppercase;
    align-items: center;
    margin: 0.2vw;
`;

const ChkLabel = styled.label``;

const ChkBox = styled.input``;

const ChkText = styled.label`
    margin : 0 auto;
`;

function Report(props) {
    const [reportType, setReportType] = useState([]);
    const [reportDetail, setReportDetail] = useState("");
    const [reportDate, setReportDate] = useState(new Date())
    const { t } = useTranslation();

    function submit() {
        request("post",`/api/reports`,{
            userEmail:props.user,
            reportId:reportType,
            etc:reportDetail
        }).then((res)=>{
            alert(t('Your report has been received successfullly'))
            setReportType([]);
            setReportDetail("");
          })
    }

    function cancelSubmit() {
        setReportType([]);
        setReportDetail("");
        document.getElementById("detailBox").value = '';
        setReportDate(new Date());
    }

    function chkboxEventCtrl(event, val) {
        if (event.target.checked) {
            setReportType([...reportType, val]);
        } else {
            setReportType(reportType.filter((element) => element !== val))
        }
    }

    function ChkBoxComponent({ value, text }) {
        return (
            <Label>
                <ChkBox
                    type="checkbox"
                    value={value}
                    id={value}
                    onChange={(e) => { chkboxEventCtrl(e, value) }}
                    checked={reportType.includes(value) ? true : false}>
                </ChkBox>
                <ChkLabel for={value} className="box">
                    <div className="tick"></div>
                </ChkLabel>
                <ChkText for={value}>{text}</ChkText>
            </Label>
        );
    };

    function renderCheckBoxComponent() {
        let result = [];

        const labelContent = [
            [<strong>{t('SEXUAL ACCESS')}</strong>, <br />, <small>{t('SEXUAL HARASSMENT, FORCED CONVERSATION, PORNOGRAPHIC BROADCASTS, ETC')}</small>],
            [<strong>{t('VERBAL ABUSE')}</strong>, <br />, <small>{t('ABUSE, DISPARAGING REMARKS, ETC')}</small>],
            [<strong>{t('HARMFUL OR DANGEROUS ACTS')}</strong>, <br />, <small>{t('EVENTS OF CURELTY, SUCH AS INCITING TERRORISM, ARSON, TORTURE, ETC')}</small>],
            [<strong>{t('INVESTMENT AND MULTI-LEVEL CORECION')}</strong>],
            [<strong>{t('ACT OF CAUSING SPAN OR CONFUSION')}</strong>]
        ]
        for (let i = 0; i < 5; i++) {
            result.push(<ChkBoxComponent value={i} text={labelContent[i]}></ChkBoxComponent>)
        }
        return result;
    }

    return (
        <CommonFrame
            header={<Title title={t('Report')}></Title>}
            body={
                <Frame>
                    <PreInputGroup>
                        <PreInput type="text" id="reportDate" inputWidth="8vw" inputHeight="1vw" value={`${reportDate.getFullYear()}. ${String(reportDate.getMonth()).padStart(2, '0')}. ${String(reportDate.getDate()).padStart(2, '0')}`} readOnly/>
                        <PreInput type="text" id="reportTime" inputWidth="8.2vw" inputHeight="1vw" value={`${String(reportDate.getHours()).padStart(2, '0')}:${String(reportDate.getMinutes()).padStart(2, '0')}:${String(reportDate.getSeconds()).padStart(2, '0')} UTC${(parseInt(reportDate.getTimezoneOffset()) > 0) ? "-" + String(parseInt(reportDate.getTimezoneOffset()) / (-60)) : "+" + String(parseInt(reportDate.getTimezoneOffset()) / (-60))}`} readOnly/>
                    </PreInputGroup>

                    <ChkBoxGroup>
                        {renderCheckBoxComponent()}

                        <Label>
                            <LargeInput
                                id="detailBox"
                                onChange={(e) => { setReportDetail(e.target.value) }}
                                placeholder={t('Please write down other reports')}
                                value={reportDetail}
                            />
                        </Label>
                    </ChkBoxGroup>

                    <TFBtnSet
                        radius="5px"
                        width="6vw"
                        height="2vw"
                        fontSize="1vw"
                        function_ok={() => { submit(reportType, reportDetail) }}
                        function_cancel={() => { cancelSubmit() }}/>
                </Frame>
            }>
        </CommonFrame>

    )
};
export default Report;
