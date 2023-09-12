import React, { useCallback, useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../../loader';
import { IWebsiteOneInfo } from '../../../types/websiteTypes';
import { useDropzone } from 'react-dropzone';
import { HexColorPicker } from "react-colorful";
import ShowImage from '../../showImage';
import { addDocument, getDataFromDBOne, updateDocument, uploadFile } from '../../../api/mainApi';
import { checkForWebsiteName } from '../../../api/infoApi';
import imageCompression from 'browser-image-compression';
import { WEBSITE_INFO_COLLECTION } from '../../../constants/websiteConstants';
import { AMDIN_FIELD } from '../../../constants/constants';
import { print } from '../../../utils/console';

const WebOneWebsiteInfo = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [info, setInfo] = useState<IWebsiteOneInfo>({
        id: "",
        websiteName: "",
        adminId: "",
        userId: "",
        logo: {
            original: "",
            thumbnail: ""
        },
        serviceProviderName: "",
        headerImage: {
            original: "",
            thumbnail: ""
        },
        headerTitle: "",
        headerText: "",
        aboutUsImage: {
            original: "",
            thumbnail: ""
        },
        aboutUsTitle: "",
        aboutUsInfo: "",
        themeMainColor: "#8b0e06",
        themeSecondaryColor: "#8b0e06",

        reservation: true,
        contactUsImage: {
            original: "",
            thumbnail: ""
        },
        email: "",
        address: "",
        phone: "",
        date: new Date(),
        dateString: new Date().toDateString()

    });
    const [logoImageAdded, setLogoImageAdded] = useState(false);
    const [files, setFiles] = useState<any[]>([]);
    const [logoImage, setLogoImage] = useState<any>();
    const [aboutUsImage, setAboutUsImage] = useState<any>();
    const [headerImage, setHeaderImage] = useState<any>();
    const [aboutUsImageFile, setAboutUsImageFile] = useState<any>();
    const [headerImageFile, setHeaderImageFile] = useState<any>();
    const [contactUsImage, setContactUsImage] = useState<any>();
    const [contactImageFile, setContactImageFile] = useState<any>();
    const [colorPrimary, setColorPrimary] = useState("#aabbcc");
    const [colorSec, setColorSecondary] = useState("#aabbcc");
    const [reservation, setReservation] = useState(false);
    const [adminId, setAdminId] = useState("adminId");





    useEffect(() => {


        getWebsiteInfo();

    }, []);


    const getWebsiteInfo = () => {

        getDataFromDBOne(WEBSITE_INFO_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {
                v.data.forEach(element => {
                    let d = element.data();

                    setInfo({
                        id: element.id,
                        websiteName: d.websiteName,
                        adminId: d.adminId,
                        userId: d.userId,
                        logo: d.logo,
                        serviceProviderName: d.serviceProviderName,
                        headerImage: d.headerImage,
                        headerTitle: d.headerTitle,
                        headerText: d.headerText,
                        aboutUsImage: d.aboutUsImage,
                        aboutUsTitle: d.aboutUsTitle,
                        aboutUsInfo: d.aboutUsInfo,
                        themeMainColor: d.themMainColor,
                        themeSecondaryColor: d.themeSecondaryColor,
                        reservation: d.reservation,
                        contactUsImage: d.contactUsImage,
                        email: d.email,
                        address: d.address,
                        phone: d.phone,
                        date: d.date,
                        dateString: d.dateString
                    });

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });

    }

    const handleChange = (e: any) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        })
    }


    const onDrop = useCallback((acceptedFiles: any[]) => {

        var reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onload = function () {
            if (reader.result !== null) {
                setLogoImage(reader.result);
                setLogoImageAdded(true);
            }

        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        // Do something with the files
        if (files.length > 0) {
            let currFiles = files;

            currFiles.concat(acceptedFiles);
            setFiles(currFiles);
        } else {
            setFiles(acceptedFiles);
        }




    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const addWebsiteInfo = async () => {




        if (files.length > 0 && typeof aboutUsImageFile !== 'undefined' && typeof headerImageFile !== 'undefined') {
            setLoading(true);



            try {

                let res = await checkForWebsiteName(info.websiteName);
                if (res) {

                    const name = files[0].name;
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    }


                    // Upload Logo
                    await uploadFile(`${info.websiteName}/logo/${name}`, files[0]);

                    const compressedLogoFile = await imageCompression(files[0], options);
                    // Thumbnail
                    await uploadFile(`${info.websiteName}/logo/thumbnail_${name}`, compressedLogoFile);

                    // Upload Header
                    await uploadFile(`${info.websiteName}/header/${headerImageFile.name}`, headerImageFile);

                    const compressedHeaderFile = await imageCompression(headerImageFile, options);
                    // Thumbnail
                    await uploadFile(`${info.websiteName}/header/thumbnail_${headerImageFile.name}`, compressedHeaderFile);

                    // Upload About Us
                    await uploadFile(`${info.websiteName}/about/${aboutUsImageFile.name}`, aboutUsImageFile);

                    const compressedAboutUsImageFileFile = await imageCompression(aboutUsImageFile, options);
                    // Thumbnail
                    await uploadFile(`${info.websiteName}/about/thumbnail_${aboutUsImageFile.name}`, compressedAboutUsImageFileFile);


                    // Upload Contact Us
                    await uploadFile(`${info.websiteName}/contact/${contactImageFile.name}`, contactImageFile);

                    const compressedContactUsImageFileFile = await imageCompression(contactImageFile, options);
                    // Thumbnail
                    await uploadFile(`${info.websiteName}/contact/thumbnail_${contactImageFile.name}`, compressedContactUsImageFileFile);



                    let newInfo: IWebsiteOneInfo = {
                        ...info,
                        adminId: "adminId",
                        userId: "",
                        logo: {
                            original: name,
                            thumbnail: `thumbnail_${name}`,
                        },
                        headerImage: {
                            original: headerImageFile.name,
                            thumbnail: `thumbnail_${headerImageFile.name}`
                        },
                        aboutUsImage: {
                            original: aboutUsImageFile.name,
                            thumbnail: `thumbnail_${aboutUsImageFile.name}`
                        },
                        themeMainColor: colorPrimary,
                        themeSecondaryColor: colorSec,
                        reservation: reservation,
                        contactUsImage: {
                            original: contactImageFile.name,
                            thumbnail: `thumbnail_${contactImageFile.name}`
                        },


                    }

                    if (info.id === "") {
                        addDocument(WEBSITE_INFO_COLLECTION, newInfo).then((v) => {

                            setFiles([]);
                            getWebsiteInfo();
                        }).catch((e: any) => {
                            setFiles([]);
                            getWebsiteInfo();
                            console.error(e);
                            toast.error('There was an error please try again');
                        });
                    } else {

                        updateDocument(WEBSITE_INFO_COLLECTION, info.id, newInfo).then((v) => {

                            setFiles([]);
                            getWebsiteInfo();
                        }).catch((e: any) => {
                            setFiles([]);
                            getWebsiteInfo();
                            console.error(e);
                            toast.error('There was an error please try again');
                        });
                    }










                } else {
                    toast.error('Website Name already taken please choose another website name');
                }

            } catch (e) {
                console.error(e);
            }



        } else {
            toast.error('Ooops looks like you left out your logo');
        }

    }


    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4  grid grid-cols-2">
                    <div>
                        <div {...getRootProps()} className='border-dashed h-48 w-full border-2 p-8 flex content-center items-center text-center ' >
                            <input {...getInputProps()} />
                            <>
                                {logoImageAdded ? <p>Logo added</p>
                                    : <>
                                        {
                                            isDragActive ?
                                                <p className='text-center'>Drop the logo here ...</p> :
                                                <p className='text-center'> Drag &lsquo;n&lsquo; drop some logo here, or click to select logo image</p>
                                        }
                                    </>
                                }
                            </>

                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Enter your unique website name</p>
                            <input
                                type="text"
                                value={info.websiteName}
                                placeholder={"Website Name"}
                                name="websiteName"
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Enter your business name</p>
                            <input
                                type="text"
                                value={info.serviceProviderName}
                                placeholder={"Service Provider Name"}
                                name="serviceProviderName"
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Select header image</p>
                            <input
                                type="file"
                                // value={info.headerTitle}
                                name="headerTitle"
                                placeholder={"Header Title"}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const img = e.target.files[0];
                                        var reader = new FileReader();
                                        reader.readAsDataURL(img);
                                        reader.onload = function () {
                                            if (reader.result !== null) {
                                                setHeaderImage(reader.result);
                                                setLogoImageAdded(true);
                                                setHeaderImageFile(img);
                                            }

                                        };
                                        reader.onerror = function (error) {
                                            console.log('Error: ', error);
                                        };


                                    }
                                }}
                                accept=".png,.jpeg,.jpg"
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Select header title</p>
                            <input
                                type="text"
                                value={info.headerTitle}
                                name="headerTitle"
                                placeholder={"Header Title"}
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Enter header text</p>
                            <textarea
                                value={info.headerText}
                                name="headerText"
                                placeholder={"Header Text"}
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Select about image</p>
                            <input
                                type="file"
                                // value={info.headerTitle}
                                name="headerTitle"
                                placeholder={"Header Title"}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const img = e.target.files[0];
                                        var reader = new FileReader();
                                        reader.readAsDataURL(img);
                                        reader.onload = function () {
                                            if (reader.result !== null) {

                                                setAboutUsImage(reader.result);
                                                setLogoImageAdded(true);
                                                setAboutUsImageFile(img);
                                            }

                                        };
                                        reader.onerror = function (error) {
                                            console.log('Error: ', error);
                                        };

                                    }
                                }}
                                accept=".png,.jpeg,.jpg"
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>About us title</p>
                            <input
                                type="text"
                                value={info.aboutUsTitle}
                                name="aboutUsTitle"
                                placeholder={"About Us Title"}
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Enter about us info</p>
                            <textarea
                                value={info.aboutUsInfo}
                                placeholder={"About Us Title"}
                                onChange={handleChange}
                                name="aboutUsInfo"
                                className="
                                        w-full
                                        h-48
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Select contact us image</p>
                            <input
                                type="file"
                                // value={info.headerTitle}
                                name="contactUsImage"
                                placeholder={"Contact Us image"}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const img = e.target.files[0];
                                        var reader = new FileReader();
                                        reader.readAsDataURL(img);
                                        reader.onload = function () {
                                            if (reader.result !== null) {

                                                setContactUsImage(reader.result);
                                                setLogoImageAdded(true);
                                                setContactImageFile(img);
                                            }

                                        };
                                        reader.onerror = function (error) {
                                            console.log('Error: ', error);
                                        };

                                    }
                                }}
                                accept=".png,.jpeg,.jpg"
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <input
                                type="text"
                                name="address"
                                value={info.address}
                                placeholder={"Address"}
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <input
                                type="text"
                                value={info.email}
                                name="email"
                                placeholder={"Email"}
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 w-full">
                            <input
                                type="text"
                                value={info.phone}
                                placeholder={"Main Phone"}
                                name="phone"
                                onChange={handleChange}
                                className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                required
                            />
                        </div>
                        <div className="mb-6 grid grid-cols-2 ">
                            <div>
                                <p className='text-xs text-gray-300 mb-4 font-bold  w-full'>Pick primary color</p>
                                <HexColorPicker color={info.themeMainColor} onChange={setColorPrimary} />
                            </div>
                            <div>
                                <p className='text-xs text-gray-300 mb-4 font-bold  w-full'>Pick secondary color</p>
                                <HexColorPicker color={info.themeSecondaryColor} onChange={setColorSecondary} />
                            </div>

                        </div>
                        <div className=' mb-6 w-full' >
                            <input
                                onChange={() => { setReservation(true) }}
                                type="checkbox"
                                id="terms"
                                name="terms"
                                value="terms"
                                className='accent-[#8b0e06] text-white bg-whites' />
                            <label htmlFor="terms"> Allow people to make reservations</label><br></br>
                        </div>
                        <button
                            onClick={() => {
                                addWebsiteInfo()
                            }}
                            className="
                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        border-primary
                                        py-3
                                        px-10
                                        bg-[#8b0e06]
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    "
                        >
                            {info.id === "" ? 'Add Website Info' : 'Update Website Info'}
                        </button>

                    </div>
                    <div className='flex flex-col items-center space-y-2 w-full text-center'>
                        <p className='text-center text-xs text-gray-300 mb-4 font-bold w-full'>Your Basic Info</p>
                        {info.id !== "" ?
                            <ShowImage src={`${info.websiteName}/logo/${info.logo.thumbnail}`} alt={'logo'} style={'rounded-[25px] shadow-md w-48 h-48'} />
                            : <img src={logoImageAdded ? logoImage : `${logoImage}`} className='rounded-[25px] shadow-md w-48 h-48' />}
                        <h1 className='mb-6 w-full'>Website Name: {info.websiteName}.foodiesbooth.com</h1>
                        <h1 className='mb-6 w-full'>Trading Name: {info.serviceProviderName}</h1>
                        {info.id !== "" ?
                            <ShowImage src={`${info.websiteName}/header/${info.headerImage.thumbnail}`} alt={'logo'} style={'rounded-[25px] shadow-md w-48 h-48'} />
                            : <img src={logoImageAdded ? headerImage : `${headerImage}`} className='rounded-[25px] shadow-md w-48 h-48' />}
                        <h1 className='mb-6 w-full'>{info.headerTitle}</h1>
                        <p className='mb-6 w-full'>{info.headerText}</p>
                        {info.id !== "" ?
                            <ShowImage src={`${info.websiteName}/about/${info.aboutUsImage.thumbnail}`} alt={'logo'} style={'rounded-[25px] shadow-md w-48 h-48'} />
                            : <img src={logoImageAdded ? aboutUsImage : `${aboutUsImage}`} className='rounded-[25px] shadow-md w-48 h-48' />}
                        <h1 className='mb-6 w-full'>{info.aboutUsTitle}</h1>
                        <h1 className='mb-6 w-full'>{info.aboutUsInfo}</h1>
                        {info.id !== "" ?
                            <ShowImage src={`${info.websiteName}/contact/${info.contactUsImage.thumbnail}`} alt={'logo'} style={'rounded-[25px] shadow-md w-48 h-48'} />
                            : <img src={logoImageAdded ? contactUsImage : `${contactUsImage}`} className='rounded-[25px] shadow-md w-48 h-48' />}
                        <p className='mb-6 w-full'>{info.email}</p>
                        <h1 className='mb-6 w-full'>{info.phone}</h1>
                        <h1 className='mb-6 w-full'>{info.address}</h1>

                    </div>

                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default WebOneWebsiteInfo;
