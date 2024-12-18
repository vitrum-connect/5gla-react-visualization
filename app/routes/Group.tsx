interface Props {
    params: {
        groupId: string
    }
}

function Group({ params }: Props) {
    return <p>{ params.groupId }</p>
}

export default Group;