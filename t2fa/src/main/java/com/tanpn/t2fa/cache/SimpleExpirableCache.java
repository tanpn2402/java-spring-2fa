package com.tanpn.t2fa.cache;

import java.util.HashMap;
import java.util.Map;

class DataCache<V> {
    private V data;
    private long initialTime;

    public DataCache(V data) {
        this.data = data;
        this.initialTime = System.currentTimeMillis();
    }

    public V getData() {
        return data;
    }

    public void setData(V data) {
        this.data = data;
    }

    public long getInitialTime() {
        return initialTime;
    }

    public void setInitialTime(long initialTime) {
        this.initialTime = initialTime;
    }
}

public class SimpleExpirableCache<T, V> {
    protected Map<T, DataCache<V>> mvMap;
    protected long mvExpiredTime;

    public SimpleExpirableCache(long expiredTime) {
        this.mvExpiredTime = expiredTime;
        this.mvMap = new HashMap<>();
    }

    public V get(T pKey) {
        DataCache<V> lvData = this.mvMap.get(pKey);

        if (lvData != null) {
            if (System.currentTimeMillis() - lvData.getInitialTime() > mvExpiredTime) {
                this.mvMap.remove(pKey);
                return null;
            }
        }

        return lvData.getData();
    }

    public void put(T pKey, V pValue) {
        DataCache<V> lvData = new DataCache<V>(pValue);
        this.mvMap.put(pKey, lvData);
    }
}
