export interface HeaderProps {
    titulo: string,
    children?: any
}

export default function AdminHeader({ titulo, children }: HeaderProps ) {
    return (<div className="card shadow-lg card-profile mb-3">
    <div className="card-body p-3">
      <div className="row gx-4">
        <div className="col-auto my-auto">
          <div className="h-100">
            <h5 className="mb-1">
              {titulo}
            </h5>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
            <div className="nav-wrapper position-relative end-0">
                {children}
            </div>
        </div>
      </div>
    </div>
  </div>)
}