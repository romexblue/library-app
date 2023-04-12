import React, { useRef, useState } from 'react';
import { PDFViewer, Document, Page, Text, StyleSheet, Image } from '@react-pdf/renderer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toPng } from 'html-to-image';
import '../styles/Reservation.css'
const data = [
    { month: 'Jan', hours: 4 },
    { month: 'Feb', hours: 2 },
    { month: 'Mar', hours: 8 },
    { month: 'Apr', hours: 6 },
    { month: 'May', hours: 4 },
    { month: 'Jun', hours: 2 },
    { month: 'Jul', hours: 8 },
    { month: 'Aug', hours: 6 },
    { month: 'Sep', hours: 4 },
    { month: 'Oct', hours: 2 },
    { month: 'Nov', hours: 8 },
    { month: 'Dec', hours: 6 },
];

const Stats = () => {
    const styles = StyleSheet.create({
        page: {
            padding: '1in',
        },
        heading: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
            alignSelf: "center"
        },
        title: {
            fontSize: 20,
            marginTop: 15,
            marginBottom: 15,
            alignSelf: "center"
        },
        body: {
            fontSize: 12,
        },
        xu_logo: {
            position: 'absolute',
            top: '0.5in',
            right: '0.8in',
            width: '1in',
            height: '1.3in',
        },
        chart: {
            width: '400px',
            height: '200px',
            visibility: 'visible'
        },
    });

    const xu_logo = 'https://edukasyon-production.s3.amazonaws.com/uploads/school/avatar/423/xavier-university-ateneo-de-cagayan-logo.jpg';
    const chartRef = useRef(null);
    const [imageUrl, setImageUrl] = useState();
    const generateChart = () => {
        toPng(chartRef.current).then(function (dataUrl) {
            setImageUrl(dataUrl);
        });
        console.log(imageUrl)
    };
    return (
        <div style={{ position: 'relative' }}>
            <div ref={chartRef} style={{ position: 'absolute', zIndex: 1 }}>
                <BarChart width={600} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
            </div>
            <div className='Cover' style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, width: '100%', height: '100%' }}>
                <PDFViewer style={{ width: '100%', height: '600px'}} >
                    <Document title='Library Statistics' size="A4" onRender={generateChart}>
                        <Page style={styles.page}>
                            <Image style={styles.xu_logo} src={xu_logo} />
                            <Text style={styles.heading}>Xavier University - Ateneo de Cagayan</Text>
                            <Text style={styles.heading}>Xavier University Library</Text>
                            <Text style={styles.title}>Library Statistics Report</Text>
                            <Text style={styles.body}>Statistics Goes Here:</Text>
                            {imageUrl && (
                                <Image src={imageUrl} style={styles.chart} alt="chart" />
                            )}
                        </Page>
                    </Document>
                </PDFViewer>
            </div>
        </div >
    );
};

export default Stats;
