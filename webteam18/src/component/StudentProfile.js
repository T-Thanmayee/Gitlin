import React from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';

function StudentProfile() {
  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem active>Student Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text-muted mb-1">Student XYZ</p>
                <p className="text-muted mb-4" style={{textAlign:'justify'}}>Fueled by caffeine and code, I'm a second-year BTech student yearning to turn theory into real-world solutions.</p>
                <div className="d-flex justify-content-center mb-2">
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <i className='ci ci-github ci-xl ms-3'>  </i>
                    <MDBCardText><a href="https://github.com/LakshitaGoyal24/" target='_blank' className='lead fs-5 link-opacity-75-hover link-underline link-underline-opacity-0'>
                           Github
                    </a></MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <i className='ci ci-gmail ci-xl ms-3'></i>
                    <MDBCardText><a href="https://github.com/LakshitaGoyal24/" target='_blank' className='lead fs-5 link-opacity-75-hover link-underline link-underline-opacity-0'>
                    webathon@gmail.com
                    </a></MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <i className='ci ci-twitter ci-xl ms-3'>  </i>
                    <MDBCardText><a href="https://github.com/LakshitaGoyal24/" target='_blank' className='lead fs-5 link-opacity-75-hover link-underline link-underline-opacity-0'>
                           Twitter
                    </a></MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <i className='ci ci-linkedin ci-xl ms-3'>  </i>
                    <MDBCardText><a href="https://github.com/LakshitaGoyal24/" target='_blank' className='lead fs-5 link-opacity-75-hover link-underline link-underline-opacity-0'>
                           LinkedIn
                    </a></MDBCardText>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Project1</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">MERN Stack</MDBCardText>
                  </MDBCol>
                  <MDBCardText className='text-muted mt-2'>E-commerce Website: A fully functional online marketplace built with React.js frontend, Node.js backend, and MongoDB database.</MDBCardText>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Project1</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">MERN Stack</MDBCardText>
                  </MDBCol>
                  <MDBCardText className='text-muted mt-2'>E-commerce Website: A fully functional online marketplace built with React.js frontend, Node.js backend, and MongoDB database.</MDBCardText>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Project1</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">MERN Stack</MDBCardText>
                  </MDBCol>
                  <MDBCardText className='text-muted mt-2'>E-commerce Website: A fully functional online marketplace built with React.js frontend, Node.js backend, and MongoDB database.</MDBCardText>
                </MDBRow>
                
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody className='row'>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-5">Certifications</span> <span className='ms-5'>Date</span></MDBCardText>
                    <MDBCardText className="mr-5 col-6">Web Design</MDBCardText>
                    <MDBCardText className="mr-5 col-6">March 2024</MDBCardText>

                    <MDBCardText className="mr-5 col-6">Web Design</MDBCardText>
                    <MDBCardText className="mr-5 col-6">March 2024</MDBCardText>

                    <MDBCardText className="mr-5 col-6">Web Design</MDBCardText>
                    <MDBCardText className="mr-5 col-6">March 2024</MDBCardText>
                    <MDBCardText className="mr-5 col-6">Web Design</MDBCardText>
                    <MDBCardText className="mr-5 col-6">March 2024</MDBCardText>

                    <MDBCardText className="mr-5 col-6">Web Design</MDBCardText>
                    <MDBCardText className="mr-5 col-6">March 2024</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Interests</MDBCardText>
                    <ul>
                    <li><MDBCardText className="mb-3">Web Design</MDBCardText></li>
                    

                    <li><MDBCardText className="mb-3">Web Design</MDBCardText></li>

                    <li><MDBCardText className="mb-3">Web Design</MDBCardText></li>

                    <li><MDBCardText className="mb-3">Web Design</MDBCardText></li>

                    <li><MDBCardText className="mb-3">Web Design</MDBCardText></li>
                    </ul>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}

export default StudentProfile;