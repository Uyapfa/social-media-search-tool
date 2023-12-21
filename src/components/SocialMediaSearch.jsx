import React, { useState } from 'react';
import { Input, Button, Card, Row, Col, Modal } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'; // Import icons from Ant Design
import axios from 'axios';

const { Meta } = Card;

const SocialMediaSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [photoData, setPhotoData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Backend API endpoint for image submission
  const API_ENDPOINT = 'http://localhost:4000/content/add';

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=4`,
        {
          headers: {
            Authorization: `jqgJo7c07JRlr9J2yHrK27CH0mg4Fibyn24ttA24dzXvNL0vF3V3Huv9}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setPhotoData(data.photos || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleImageClick = (photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
  };

  const handleImageSubmit = async () => {
    try {
      const response = await axios.post(API_ENDPOINT, {
        alt: selectedPhoto.alt,
        url: selectedPhoto.src.large,
      });

      if (response.status >= 200 && response.status < 300) {
       
        setSubmitSuccess(true);
      } else {
        
        setSubmitError(true);
      }
    } catch (error) {
  
      console.error('Error submitting image:', error.message);

      if (error.response) {
        console.log('Error response data:', error.response.data);
      }

      setSubmitError(true);
    } finally {
      setModalVisible(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSubmitSuccess(false);
  };

  const handleErrorModalClose = () => {
    setSubmitError(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* About Section */}
      <div style={{ padding: '16px', backgroundColor: '#1890ff', color: 'white', textAlign: 'center' }}>
        <h1>Welcome to PhotoSearch App!</h1>
        <p>Discover amazing photos with ease.</p>
      </div>
      <br />
      {/* Search Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 16 }}>
        <Input
          placeholder="Enter search query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button type="primary" onClick={handleSearch} style={{ width: 100 }}>
          Search
        </Button>
        <br />
        {photoData.length > 0 && (
          <Row gutter={[16, 16]}>
            {photoData.map((photo) => (
              <Col key={photo.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ width: '100%', height: '300px', marginBottom: 70 }}
                  cover={
                    <img
                      alt={photo.photographer}
                      src={photo.src.medium}
                      style={{ height: '300px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleImageClick(photo)}
                    />
                  }
                >
                  <Meta title={photo.photographer} description={`Photographer: ${photo.photographer}`} />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Modal */}
      <Modal
        title={selectedPhoto ? selectedPhoto.photographer : 'Image'}
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="submit" type="primary" onClick={handleImageSubmit}>
            Submit
          </Button>,
        ]}
      >
        {selectedPhoto && (
          <img alt={selectedPhoto.photographer} src={selectedPhoto.src.large} style={{ width: '100%' }} />
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        title="Image Submitted Successfully"
        visible={submitSuccess}
        onOk={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
        icon={<CheckCircleFilled style={{ color: '#52c41a', fontSize: '24px' }} />} // Green checkmark icon
      >
        <p>Your image has been submitted successfully!</p>
      </Modal>

      {/* Error Modal */}
      <Modal
        title="Error Submitting Image"
        visible={submitError}
        onOk={handleErrorModalClose}
        onCancel={handleErrorModalClose}
        icon={<CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '24px' }} />} // Red close icon
      >
        <p>There was an error submitting your image. Please try again later.</p>
      </Modal>
    </div>
  );
};

export default SocialMediaSearch;
