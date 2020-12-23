declare module "react-nil"
declare module "@react-hook/window-size"
declare module "stam-stable-fluids"
declare module "worker-loader!*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export default WebpackWorker;
}