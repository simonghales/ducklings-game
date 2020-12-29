declare module "react-nil"
declare module "@react-hook/window-size"
declare module "stam-stable-fluids"
declare module "canvas-sketch-util"
declare module "canvas-sketch-util/random"
declare module "worker-loader!*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export default WebpackWorker;
}