export default function LoginLayout({children}: any) {
    return (<main>
        <div className="container position-sticky z-index-sticky top-0">
          <div className="row">
            <div className="col-12">
              {/* <!-- Navbar --> */}
              <nav className="navbar navbar-expand-lg blur border-radius-lg top-0 z-index-3 shadow position-absolute mt-4 py-2 start-0 end-0 mx-4">
                <div className="container-fluid" style={{flex: 1, justifyContent: 'center'}}>
                    <p style={{fontWeight: 'bold', marginTop: 10}}>Template ADMIN</p>
                </div>
              </nav>
              {/* <!-- End Navbar --> */}
            </div>
          </div>
        </div>
        <main className="main-content  mt-0">
            <section>
            {children}
            </section>
        </main>  
    </main>)
}