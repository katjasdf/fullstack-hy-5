import PropTypes from 'prop-types'

const Notification = ({ data }) => {
    if (data === null) return null

    return (
        <div className={data.type}>
            {data.message}
        </div>
    )
}

Notification.propTypes = {
    data: PropTypes.object.isRequired
}

export default Notification