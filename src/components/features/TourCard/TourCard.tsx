import type { Hotel, PriceOffer } from '../../../types';
import { Button } from '../../ui';
import { getCountryFlagUrl } from '../../../utils';
import styles from './TourCard.module.scss';

export interface TourCardProps {
    hotel: Hotel;
    price: PriceOffer;
    onOpenPrice: (priceId: string) => void;
}

export function TourCard({ hotel, price, onOpenPrice }: TourCardProps) {
    const handleClick = () => {
        onOpenPrice(price.id);
    };

    return (
        <article className={styles.card}>
            <div className={styles.card__image}>
                <img src={hotel.img} alt={hotel.name} />
            </div>

            <div className={styles.card__content}>
                <h3 className={styles.card__title}>{hotel.name}</h3>

                <div className={styles.card__location}>
                    <img
                        src={getCountryFlagUrl(hotel.countryId)}
                        alt={hotel.countryName}
                        className={styles.card__flag}
                    />
                    <span className={styles.card__city}>
            {hotel.cityName}, {hotel.countryName}
          </span>
                </div>

                <div className={styles.card__info}>
                    <div className={styles.card__date}>
                        <span className={styles.card__label}>Start date:</span>
                        <span className={styles.card__value}>
              {new Date(price.startDate).toLocaleDateString('uk-UA')}
            </span>
                    </div>

                    <div className={styles.card__price}>
            <span className={styles.card__amount}>
              ${price.amount.toLocaleString()}
            </span>
                        <span className={styles.card__currency}>USD</span>
                    </div>
                </div>

                <Button
                    variant="primary"
                    fullWidth
                    onClick={handleClick}
                    className={styles.card__button}
                >
                    Open Price
                </Button>
            </div>
        </article>
    );
}