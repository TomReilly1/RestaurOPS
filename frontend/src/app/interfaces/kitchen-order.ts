import { KitchenItem } from "./kitchen-item";

export interface KitchenOrder {
    order_id: string;
    items_list: KitchenItem[];
}