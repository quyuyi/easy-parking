import React, { Component } from 'react';

class FromDestToPL extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { color } = this.props;
        return (
            <svg width="80" height="35" viewBox="0 -5 70 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter4)">
                    <circle cx="11.5" cy="7.5" r="7.5" fill={color}/>
                </g>
                <g filter="url(#filter5)">
                    <path d="M11.5 23L5.00481 11.75L17.9952 11.75L11.5 23Z" fill={color}/>
                </g>
                <path d="M10.8721 9.49512V12H9.40723V4.89062H12.1807C12.7145 4.89062 13.1833 4.98828 13.5869 5.18359C13.9938 5.37891 14.3063 5.65723 14.5244 6.01855C14.7425 6.37663 14.8516 6.78516 14.8516 7.24414C14.8516 7.94076 14.6123 8.49089 14.1338 8.89453C13.6585 9.29492 12.9993 9.49512 12.1562 9.49512H10.8721ZM10.8721 8.30859H12.1807C12.568 8.30859 12.8626 8.21745 13.0645 8.03516C13.2695 7.85286 13.3721 7.59245 13.3721 7.25391C13.3721 6.9056 13.2695 6.62402 13.0645 6.40918C12.8594 6.19434 12.5762 6.08366 12.2148 6.07715H10.8721V8.30859Z" fill="white"/>
                <path d="M45.7071 11.7071C46.0976 11.3166 46.0976 10.6834 45.7071 10.2929L39.3431 3.92893C38.9526 3.53841 38.3195 3.53841 37.9289 3.92893C37.5384 4.31946 37.5384 4.95262 37.9289 5.34315L43.5858 11L37.9289 16.6569C37.5384 17.0474 37.5384 17.6805 37.9289 18.0711C38.3195 18.4616 38.9526 18.4616 39.3431 18.0711L45.7071 11.7071ZM25 12H45V10H25V12Z" fill="black" fillOpacity="0.5"/>
                <g filter="url(#filter6)">
                    <circle cx="58.5" cy="7.5" r="7.5" fill="#F33B9E"/>
                </g>
                <g filter="url(#filter7)">
                    <path d="M58.5 23L52.0048 11.75L64.9952 11.75L58.5 23Z" fill="#F33B9E"/>
                </g>
                <path d="M58.5 2L59.7348 5.80041H63.7308L60.498 8.14919L61.7328 11.9496L58.5 9.60081L55.2672 11.9496L56.502 8.14919L53.2692 5.80041H57.2652L58.5 2Z" fill="white"/>
                <defs>
                    <filter id="filter4" x="0" y="0" width="23" height="23" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    </filter>
                    <filter id="filter5" x="1.00482" y="11.75" width="20.9904" height="19.25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    </filter>
                    <filter id="filter6" x="47" y="0" width="23" height="23" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    </filter>
                    <filter id="filter7" x="48.0048" y="11.75" width="20.9904" height="19.25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    </filter>
                </defs>
            </svg>
        );
    }
}

export default FromDestToPL;
