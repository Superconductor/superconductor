interface IRoot {}
class Root : IRoot {
    actions {
        loop child {
            child.foo := 30;
        }
    }
}
