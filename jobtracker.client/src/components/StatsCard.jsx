function StatsCard({ title, value, icon, bgColor, textColor }) {
    return (
        <div className="col-md-3 mb-3">
            <div className={`card ${bgColor} ${textColor} h-100`}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="card-title">{value}</h4>
                            <p className="card-text mb-0">{title}</p>
                        </div>
                        <div className="fs-1 opacity-75">{icon}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsCard;